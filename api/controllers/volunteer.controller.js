import Volunteer from '../models/volunteer.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import mongoose from 'mongoose';

export const test = (req, res) => {
    res.json({ message: 'API is working' });
};

/**
 * Get the current volunteer's profile
 * @route GET /api/volunteers/profile
 * @access Private - Only for authenticated volunteers
 */
export const getVolunteerProfile = async (req, res) => {
    try {
        // Get the volunteer ID from the authenticated user
        const authId = req.user.id;
        
        if (!authId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        // Find the volunteer profile using the auth ID
        const volunteer = await Volunteer.findOne({ auth: authId })
            .populate('auth', 'name email -_id');
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        
        res.status(200).json({
            message: 'Profile retrieved successfully',
            data: volunteer
        });
    } catch (error) {
        console.error('Error in getVolunteerProfile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update volunteer's basic details (Step 1)
 * @route PUT /api/volunteers/profile/basic
 * @access Private - Only for authenticated volunteers
 */
export const updateBasicDetails = async (req, res) => {
    try {
        // Get volunteer ID from authenticated user
        const authId = req.user.id;
        
        // Find the volunteer
        let volunteer = await Volunteer.findOne({ auth: authId });
        
        // If volunteer profile doesn't exist yet, create one
        if (!volunteer) {
            volunteer = new Volunteer({
                auth: authId,
                basicDetails: req.body,
                profileCompletion: {
                    step1: true,
                    step2: false,
                    step3: false
                }
            });
        } else {
            // Update existing profile
            volunteer.basicDetails = req.body;
            volunteer.profileCompletion.step1 = true;
        }
        
        // Save the volunteer profile
        await volunteer.save();
        
        res.status(200).json({
            message: 'Basic details updated successfully',
            data: volunteer
        });
    } catch (error) {
        console.error('Error in updateBasicDetails:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update volunteer's interests and skills (Step 2)
 * @route PUT /api/volunteers/profile/interests
 * @access Private - Only for authenticated volunteers
 */
export const updateInterests = async (req, res) => {
    try {
        // Get volunteer ID from authenticated user
        const authId = req.user.id;
        
        // Find the volunteer
        let volunteer = await Volunteer.findOne({ auth: authId });
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found. Please complete step 1 first.' });
        }
        
        // Update interests
        volunteer.interests = req.body;
        volunteer.profileCompletion.step2 = true;
        
        // Save the volunteer profile
        await volunteer.save();
        
        res.status(200).json({
            message: 'Interests and skills updated successfully',
            data: volunteer
        });
    } catch (error) {
        console.error('Error in updateInterests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update volunteer's engagement info (Step 3)
 * @route PUT /api/volunteers/profile/engagement
 * @access Private - Only for authenticated volunteers
 */
export const updateEngagement = async (req, res) => {
    try {
        // Get volunteer ID from authenticated user
        const authId = req.user.id;
        
        // Find the volunteer
        let volunteer = await Volunteer.findOne({ auth: authId });
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found. Please complete previous steps first.' });
        }
        
        // Update engagement
        volunteer.engagement = req.body;
        volunteer.profileCompletion.step3 = true;
        
        // Save the volunteer profile
        await volunteer.save();
        
        res.status(200).json({
            message: 'Engagement information updated successfully',
            data: volunteer
        });
    } catch (error) {
        console.error('Error in updateEngagement:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Upload volunteer profile photo
 * @route POST /api/volunteers/profile/photo
 * @access Private - Only for authenticated volunteers
 */
export const uploadProfilePhoto = async (req, res) => {
    try {
        // Get volunteer ID from authenticated user
        const authId = req.user.id;
        
        // Find the volunteer
        let volunteer = await Volunteer.findOne({ auth: authId });
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        
        // Check if photo was uploaded (this would be handled by a middleware)
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No photo uploaded' });
        }
        
        // Update profile photo
        volunteer.profilePhoto = req.file.path;
        
        // Save the volunteer profile
        await volunteer.save();
        
        res.status(200).json({
            message: 'Profile photo updated successfully',
            data: {
                profilePhoto: volunteer.profilePhoto
            }
        });
    } catch (error) {
        console.error('Error in uploadProfilePhoto:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};