import Volunteer from '../models/volunteer.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import mongoose from 'mongoose';

/**
 * Get volunteer details by ID for provider dashboard
 * @route GET /api/provider/volunteers/:id
 * @access Private - Provider only
 */
export const getVolunteerById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid volunteer ID' });
        }
        
        // Check if user is authenticated and is a provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Provider access required.' });
        }
        
        // Find the volunteer by ID
        const volunteer = await Volunteer.findById(id)
            .populate('auth', 'name email'); // Populate auth fields we need
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        
        // Format the response with needed data
        const formattedVolunteer = {
            id: volunteer._id,
            name: volunteer.auth.name,
            email: volunteer.auth.email,
            profilePhoto: volunteer.profilePhoto,
            basicDetails: volunteer.basicDetails,
            interests: volunteer.interests,
            skills: volunteer.interests?.skills || [],
            // No experience field as mentioned in the prompt
        };
        
        res.status(200).json({
            message: 'Volunteer retrieved successfully',
            data: formattedVolunteer
        });
    } catch (error) {
        console.error('Error in getVolunteerById:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
