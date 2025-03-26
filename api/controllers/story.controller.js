import jwt from 'jsonwebtoken';
import Joi from 'joi';
import {env} from "../config/env.js";
import {sanitizeNestedObject} from "../helpers/securityHelper.js";
import Story from "../models/story.model.js";
import AuthVolunteer from "../models/auth.volunteer.model.js";
import AuthOpportunityProvider from "../models/auth.opportunityprovider.model.js";
import Volunteer from "../models/volunteer.model.js";
import OpportunityProvider from "../models/opportunityprovider.model.js";

const storySchema = Joi.object({
    title: Joi.string().max(100).required().trim(),
    content: Joi.string().max(1000).required().trim(),
    photo: Joi.string().uri().optional().allow(''),
});

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, env.jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// TODO This is not working. Fix when log in is done
// Add Story
export const addStory = async (req, res) => {
    try {
        // Authenticate user
        authenticateToken(req, res, async () => {
            const { role, id } = req.user;
            if (!['volunteer', 'provider'].includes(role)) {
                return res.status(403).json({ message: 'Only Volunteers and Opportunity Providers can add stories.' });
            }

            // Validate input
            const { error } = storySchema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const { title, content, photo } = req.body;

            // Sanitize inputs
            const sanitizedData = sanitizeNestedObject({ title, content, photo });
            const { title: sanitizedTitle, content: sanitizedContent, photo: sanitizedPhoto } = sanitizedData;

            // Determine creator model based on role
            const creatorModel = role === 'volunteer' ? 'AuthVolunteer' : 'AuthOpportunityProvider';

            // Create new story
            const newStory = new Story({
                title: sanitizedTitle,
                content: sanitizedContent,
                photo: sanitizedPhoto || '',
                creator: id,
                creatorModel,
                published: false,
            });
            await newStory.save();

            res.status(201).json({ message: 'Story added successfully', story: newStory });
        });
    } catch (error) {
        console.error('Error in addStory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// View Three Stories
export const viewThreeStories = async (req, res) => {
    try {
        const stories = await Story.find({ published: true })
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(3)
            .populate({
                path: 'creator',
                select: '-password -__v',
                // Explicitly tell Mongoose which model to use based on the creatorModel field
                match: (doc) => {
                    if (doc.creatorModel === 'Volunteer' || doc.creatorModel === 'OpportunityProvider' || 
                        doc.creatorModel === 'AuthVolunteer' || doc.creatorModel === 'AuthOpportunityProvider') {
                        return {}; // Valid model, proceed with population
                    }
                    return null; // Invalid model, don't populate
                }
            })
            .lean();

        if (!stories.length) return res.status(404).json({ message: 'No published stories found.' });

        res.status(200).json({ message: 'Three recent stories retrieved', stories });
    } catch (error) {
        console.error('Error in viewThreeStories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};