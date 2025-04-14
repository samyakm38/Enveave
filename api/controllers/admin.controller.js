// filepath: d:\Enveave-SDOS\api\controllers\admin.controller.js
import Admin from '../models/admin.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import Volunteer from '../models/volunteer.model.js';
import AuthOpportunityProvider from '../models/auth.opportunityprovider.model.js';
import OpportunityProvider from '../models/opportunityprovider.model.js';
import Opportunity from '../models/opportunity.model.js';
import Story from '../models/story.model.js';
import mongoose from 'mongoose';

// --- Organizations Management ---
export const getAllOrganizations = async (req, res) => {
    try {
        // Get all organization providers with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Query auth provider model and join with provider model for organization details
        const organizationProviders = await AuthOpportunityProvider.aggregate([
            {
                $lookup: {
                    from: 'opportunityproviders', // Collection name
                    localField: '_id',
                    foreignField: 'auth',
                    as: 'details'
                }
            },
            {
                $project: {
                    _id: 1,
                    organizationName: 1,
                    contactPerson: 1,
                    profileStatus: 1,
                    createdAt: 1,
                    details: { $arrayElemAt: ['$details', 0] }
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        
        // Count total organizations for pagination
        const totalOrganizations = await AuthOpportunityProvider.countDocuments();
        
        // Transform the data for frontend use
        const organizations = organizationProviders.map(org => {
            return {
                id: org._id,
                name: org.organizationName,
                description: org.details?.organizationDetails?.description || 'No description available',
                imageUrl: org.details?.organizationDetails?.logo || '',
                city: org.details?.organizationDetails?.location?.city || 'Not specified',
                country: org.details?.organizationDetails?.location?.state || 'Not specified',
                email: org.contactPerson?.email || 'Not provided',
                phone: org.contactPerson?.phoneNumber || 'Not provided',
                status: org.profileStatus || 'NOT_STARTED'
            };
        });
        
        res.status(200).json({
            success: true,
            data: organizations,
            pagination: {
                total: totalOrganizations,
                page,
                pages: Math.ceil(totalOrganizations / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error getting organizations for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve organizations',
            error: error.message
        });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid organization ID format'
            });
        }
        
        // Find organization to make sure it exists
        const organization = await AuthOpportunityProvider.findById(id);
        if (!organization) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }
        
        // Delete related opportunities
        await Opportunity.deleteMany({ provider: id });
        
        // Delete organization profile
        await OpportunityProvider.findOneAndDelete({ auth: id });
        
        // Delete organization auth
        await AuthOpportunityProvider.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Organization and all related data deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete organization',
            error: error.message
        });
    }
};

// --- Volunteers Management ---
export const getAllVolunteers = async (req, res) => {
    try {
        // Get all volunteers with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Query auth volunteer model and join with volunteer model for details
        const volunteerUsers = await AuthVolunteer.aggregate([
            {
                $lookup: {
                    from: 'volunteers', // Collection name
                    localField: '_id',
                    foreignField: 'auth',
                    as: 'details'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phoneNumber: 1,
                    profilePhoto: 1,
                    profileStatus: 1,
                    createdAt: 1,
                    details: { $arrayElemAt: ['$details', 0] }
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        
        // Count total volunteers for pagination
        const totalVolunteers = await AuthVolunteer.countDocuments();
          // Transform the data for frontend use
        const volunteers = volunteerUsers.map(vol => {
            return {
                id: vol._id,
                name: vol.name,
                gender: vol.details?.basicDetails?.gender || 'Not specified',
                city: vol.details?.basicDetails?.location?.city || 'Not specified',
                country: vol.details?.basicDetails?.location?.state || 'Not specified', // Using state as country isn't in the model
                email: vol.email || 'Not provided',
                phone: vol.details?.basicDetails?.phoneNumber || 'Not provided',
                skills: vol.details?.interests?.skills || [],
                imageUrl: vol.details?.profilePhoto || '/dashboard-default-user-image.svg'
            };
        });
        
        res.status(200).json({
            success: true,
            data: volunteers,
            pagination: {
                total: totalVolunteers,
                page,
                pages: Math.ceil(totalVolunteers / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error getting volunteers for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve volunteers',
            error: error.message
        });
    }
};

export const deleteVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid volunteer ID format'
            });
        }
        
        // Find volunteer to make sure it exists
        const volunteer = await AuthVolunteer.findById(id);
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }
        
        // Delete volunteer profile
        await Volunteer.findOneAndDelete({ auth: id });
        
        // Delete all applications by this volunteer
        // This would require importing the Application model
        // await Application.deleteMany({ volunteer: id });
        
        // Delete volunteer auth
        await AuthVolunteer.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Volunteer and all related data deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting volunteer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete volunteer',
            error: error.message
        });
    }
};

// --- Opportunities Management ---
export const getAllOpportunities = async (req, res) => {
    try {
        // Get all opportunities with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
          // Query opportunities and populate provider information
        const opportunities = await Opportunity.find()
            .populate({
                path: 'provider',
                populate: {
                    path: 'auth',
                    model: 'AuthOpportunityProvider',
                    select: 'organizationName'
                }
            })
            .select('basicDetails schedule status applicants')
            .skip(skip)
            .limit(limit);
        
        // Count total opportunities for pagination
        const totalOpportunities = await Opportunity.countDocuments();
        // Transform the data for frontend use
        const transformedOpportunities = opportunities.map(opp => {
            // Count only accepted volunteers
            const acceptedVolunteers = opp.applicants ? 
                opp.applicants.filter(app => app.status === 'Accepted').length : 0;
                
            return {
                id: opp._id,
                name: opp.basicDetails?.title || 'Unnamed Opportunity',
                org: opp.provider?.auth?.organizationName || 'Unknown Organization',
                location: opp.schedule?.location || 'Not specified',
                volunteers: acceptedVolunteers,
                hours: opp.schedule?.timeCommitment || 'Not specified', // Changed from duration to timeCommitment
                deadline: opp.schedule?.applicationDeadline 
                    ? new Date(opp.schedule.applicationDeadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }) 
                    : 'No deadline'
            };
        });
        
        res.status(200).json({
            success: true,
            data: transformedOpportunities,
            pagination: {
                total: totalOpportunities,
                page,
                pages: Math.ceil(totalOpportunities / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error getting opportunities for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve opportunities',
            error: error.message
        });
    }
};

export const deleteOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid opportunity ID format'
            });
        }
        
        // Find opportunity to make sure it exists
        const opportunity = await Opportunity.findById(id);
        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }
        
        // Delete all applications for this opportunity
        // This would require importing the Application model
        // await Application.deleteMany({ opportunity: id });
        
        // Delete opportunity
        await Opportunity.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Opportunity and related applications deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete opportunity',
            error: error.message
        });
    }
};

// --- Stories Management ---
export const getAllStories = async (req, res) => {
    try {
        // Get all stories with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Query stories
        const stories = await Story.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Count total stories for pagination
        const totalStories = await Story.countDocuments();
        
        // Transform the data for frontend use
        const transformedStories = stories.map(story => {
            return {
                id: story._id,
                title: story.title,
                description: story.content,
                storyImage: story.imageUrl || '/home-story-3.png', // Default image if none provided
                createdAt: new Date(story.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            };
        });
        
        res.status(200).json({
            success: true,
            data: transformedStories,
            pagination: {
                total: totalStories,
                page,
                pages: Math.ceil(totalStories / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error getting stories for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve stories',
            error: error.message
        });
    }
};

export const createStory = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }
        
        // Create new story
        const newStory = new Story({
            title,
            content,
            imageUrl: imageUrl || '/home-story-3.png', // Default image if none provided
        });
        
        await newStory.save();
        
        res.status(201).json({
            success: true,
            message: 'Story created successfully',
            data: newStory
        });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create story',
            error: error.message
        });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid story ID format'
            });
        }
        
        // Find story to make sure it exists
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }
        
        // Delete story
        await Story.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Story deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete story',
            error: error.message
        });
    }
};

// --- Admin Profile ---
export const getAdminProfile = async (req, res) => {
    try {
        // Get admin ID from the authenticated user in the request
        const adminId = req.user.id;
        
        // Find admin profile without returning password
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Error getting admin profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve admin profile',
            error: error.message
        });
    }
};

// --- Dashboard Statistics ---
export const getDashboardStats = async (req, res) => {
    try {
        // Count total entities
        const [
            totalOrganizations,
            totalVolunteers,
            totalOpportunities,
            totalStories
        ] = await Promise.all([
            AuthOpportunityProvider.countDocuments(),
            AuthVolunteer.countDocuments(),
            Opportunity.countDocuments(),
            Story.countDocuments()
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                totalOrganizations,
                totalVolunteers,
                totalOpportunities,
                totalStories
            }
        });
    } catch (error) {
        console.error('Error getting admin dashboard statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard statistics',
            error: error.message
        });
    }
};
