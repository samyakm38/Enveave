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
        
        // Extract the basicDetails from the request body
        const { basicDetails } = req.body;
        
        // Validate that basicDetails exists and has required fields
        if (!basicDetails || !basicDetails.phoneNumber || !basicDetails.dateOfBirth || 
            !basicDetails.gender || !basicDetails.location) {
            return res.status(400).json({ 
                message: 'Missing required basic details fields' 
            });
        }
        
        // If volunteer profile doesn't exist yet, create one
        if (!volunteer) {
            volunteer = new Volunteer({
                auth: authId,
                basicDetails: basicDetails,
                profileCompletion: {
                    step1: true,
                    step2: false,
                    step3: false
                }
            });
        } else {
            // Update existing profile
            volunteer.basicDetails = basicDetails;
            volunteer.profileCompletion.step1 = true;
        }
        
        // Save the volunteer profile
        await volunteer.save();
        
        // Update auth volunteer profile status
        await AuthVolunteer.findByIdAndUpdate(
            authId,
            { profileStatus: 'STEP_1' }
        );
        
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
        
        // Extract the interests from the request body
        const { interests } = req.body;
        
        if (!interests) {
            return res.status(400).json({ 
                message: 'Missing interests data' 
            });
        }
        
        // Update interests
        volunteer.interests = interests;
        volunteer.profileCompletion.step2 = true;
        
        // Save the volunteer profile
        await volunteer.save();
        
        // Update auth volunteer profile status
        await AuthVolunteer.findByIdAndUpdate(
            authId,
            { profileStatus: 'STEP_2' }
        );
        
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
        
        // Extract the engagement data from the request body
        const { engagement } = req.body;
        
        if (!engagement || !engagement.availability || !engagement.motivations || 
            engagement.hasPreviousExperience === undefined) {
            return res.status(400).json({ 
                message: 'Missing required engagement fields' 
            });
        }
        
        // Update engagement info
        volunteer.engagement = engagement;
        volunteer.profileCompletion.step3 = true;
        
        // Save the volunteer profile
        await volunteer.save();
        
        // Update auth volunteer profile status to COMPLETED since this is the last step
        await AuthVolunteer.findByIdAndUpdate(
            authId,
            { profileStatus: 'COMPLETED' }
        );
        
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
import { uploadImageToCloudinary } from '../helpers/imageUpload.js';

export const uploadProfilePhoto = async (req, res) => {
    try {
        // Get volunteer ID from authenticated user
        const authId = req.user.id;
        
        // Find the volunteer
        let volunteer = await Volunteer.findOne({ auth: authId });
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        
        // Check if photo was uploaded (handled by multer middleware)
        if (!req.file) {
            return res.status(400).json({ message: 'No photo uploaded' });
        }
        
        // Upload the photo to Cloudinary
        const profilePhotoUrl = await uploadImageToCloudinary(req.file.buffer, 'volunteer_photos');
        
        // Update profile photo with Cloudinary URL
        volunteer.profilePhoto = profilePhotoUrl;
        
        // Save the volunteer profile
        await volunteer.save();
        
        res.status(200).json({
            message: 'Profile photo updated successfully',
            data: {
                profilePhoto: profilePhotoUrl
            }
        });
    } catch (error) {
        console.error('Error in uploadProfilePhoto:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update volunteer's profile status
 * @route PUT /api/volunteers/profile/status
 * @access Private - Only for authenticated volunteers
 */
export const updateProfileStatus = async (req, res) => {
    try {
        // Get volunteer auth ID from authenticated user
        const authId = req.user.id;
        
        // Validate input
        const { profileStatus } = req.body;
        if (!profileStatus || !['NOT_STARTED', 'STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED'].includes(profileStatus)) {
            return res.status(400).json({ 
                message: 'Valid profileStatus required (NOT_STARTED, STEP_1, STEP_2, STEP_3, or COMPLETED)' 
            });
        }
        
        // Update the auth profile status
        const authVolunteer = await AuthVolunteer.findByIdAndUpdate(
            authId,
            { profileStatus },
            { new: true }
        );
        
        if (!authVolunteer) {
            return res.status(404).json({ message: 'Volunteer auth profile not found' });
        }
        
        res.status(200).json({
            message: 'Profile status updated successfully',
            data: { profileStatus: authVolunteer.profileStatus }
        });
    } catch (error) {
        console.error('Error in updateProfileStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};