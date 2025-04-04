import OpportunityProvider from '../models/opportunityprovider.model.js';
import AuthOpportunityProvider from '../models/auth.opportunityprovider.model.js';
import Opportunity from '../models/opportunity.model.js';
import cloudinary from '../config/cloudinary.js';

// Get the authenticated provider's profile
export const getProviderProfile = async (req, res) => {
    try {
        // Get the provider ID from the authenticated user
        const { id } = req.user;
        
        // First, check the auth provider model for basic info
        const authProvider = await AuthOpportunityProvider.findById(id);
        if (!authProvider) {
            return res.status(404).json({ 
                success: false, 
                message: 'Provider not found' 
            });
        }
        
        // Then get the detailed provider profile
        const providerProfile = await OpportunityProvider.findOne({ 
            authProviderId: id 
        });
        
        // Combine data from both models for a complete profile
        const combinedProfile = {
            _id: authProvider._id,
            email: authProvider.email,
            phone: authProvider.phone,
            organizationName: authProvider.organizationName,
            profileCompletion: authProvider.profileCompletion || { step1: false, step2: false },
            organizationDetails: providerProfile ? {
                logo: providerProfile.logo || null,
                description: providerProfile.description || '',
                website: providerProfile.website || '',
                socialMedia: providerProfile.socialMedia || {},
                address: providerProfile.address || {},
                contactInfo: providerProfile.contactInfo || {}
            } : null
        };
        
        return res.status(200).json({
            success: true,
            data: combinedProfile
        });
    } catch (error) {
        console.error('Error getting provider profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get provider profile',
            error: error.message
        });
    }
};

// Update the provider's profile
export const updateProviderProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { 
            organizationName, 
            description, 
            website, 
            socialMedia,
            address,
            contactInfo
        } = req.body;
        
        // Update auth provider model for basic info
        const updatedAuthProvider = await AuthOpportunityProvider.findByIdAndUpdate(
            id,
            { 
                organizationName,
                profileCompletion: { step1: true, step2: true }
            },
            { new: true }
        );
        
        if (!updatedAuthProvider) {
            return res.status(404).json({ 
                success: false, 
                message: 'Provider not found' 
            });
        }
        
        // Find or create the detailed provider profile
        let providerProfile = await OpportunityProvider.findOne({ authProviderId: id });
        
        if (!providerProfile) {
            // Create new provider profile if it doesn't exist
            providerProfile = new OpportunityProvider({
                authProviderId: id,
                description,
                website,
                socialMedia,
                address,
                contactInfo
            });
            await providerProfile.save();
        } else {
            // Update existing provider profile
            providerProfile = await OpportunityProvider.findOneAndUpdate(
                { authProviderId: id },
                {
                    description,
                    website,
                    socialMedia,
                    address,
                    contactInfo
                },
                { new: true }
            );
        }
        
        // Combine updated data for response
        const updatedProfile = {
            _id: updatedAuthProvider._id,
            email: updatedAuthProvider.email,
            phone: updatedAuthProvider.phone,
            organizationName: updatedAuthProvider.organizationName,
            profileCompletion: updatedAuthProvider.profileCompletion,
            organizationDetails: {
                logo: providerProfile.logo || null,
                description: providerProfile.description || '',
                website: providerProfile.website || '',
                socialMedia: providerProfile.socialMedia || {},
                address: providerProfile.address || {},
                contactInfo: providerProfile.contactInfo || {}
            }
        };
        
        return res.status(200).json({
            success: true,
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating provider profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update provider profile',
            error: error.message
        });
    }
};

// Upload provider logo
export const uploadProviderLogo = async (req, res) => {
    try {
        const { id } = req.user;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'provider_logos'
        });
        
        // Update provider profile with new logo URL
        const updatedProfile = await OpportunityProvider.findOneAndUpdate(
            { authProviderId: id },
            { logo: result.secure_url },
            { new: true, upsert: true } // Create if it doesn't exist
        );
        
        return res.status(200).json({
            success: true,
            data: {
                logoUrl: result.secure_url
            }
        });
    } catch (error) {
        console.error('Error uploading logo:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload logo',
            error: error.message
        });
    }
};

// Get provider statistics
export const getProviderStats = async (req, res) => {
    try {
        const { id } = req.user;
        
        // Get all opportunities created by this provider
        const opportunities = await Opportunity.find({ 
            provider: id 
        }).populate('applications');
        
        // Calculate statistics
        const totalOpportunities = opportunities.length;
        const currentDate = new Date();
        
        let totalVolunteers = 0;
        let completedProjects = 0;
        
        opportunities.forEach(opp => {
            // Count accepted volunteers
            if (opp.applications && opp.applications.length > 0) {
                const acceptedVolunteers = opp.applications.filter(
                    app => app.status === 'Accepted'
                ).length;
                totalVolunteers += acceptedVolunteers;
            }
            
            // Count completed projects based on end date
            if (opp.schedule && opp.schedule.endDate) {
                const endDate = new Date(opp.schedule.endDate);
                if (endDate < currentDate) {
                    completedProjects += 1;
                }
            }
        });
        
        return res.status(200).json({
            success: true,
            data: {
                totalOpportunities,
                totalVolunteers,
                completedProjects
            }
        });
    } catch (error) {
        console.error('Error getting provider stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get provider statistics',
            error: error.message
        });
    }
};

// Get provider dashboard data (combined profile, stats and opportunities)
export const getProviderDashboard = async (req, res) => {
    try {
        const { id } = req.user;
        
        // Get provider profile
        const authProvider = await AuthOpportunityProvider.findById(id);
        if (!authProvider) {
            return res.status(404).json({ 
                success: false, 
                message: 'Provider not found' 
            });
        }
        
        const providerProfile = await OpportunityProvider.findOne({ 
            auth: id 
        });
        
        // Get all opportunities created by this provider
        const opportunities = await Opportunity.find({ 
            provider: id 
        }).populate('applications');
        
        // Calculate statistics
        const totalOpportunities = opportunities.length;
        const currentDate = new Date();
        
        let totalVolunteers = 0;
        let completedProjects = 0;
        
        // Process opportunities to include isCompleted flag
        const processedOpportunities = opportunities.map(opp => {
            // Count accepted volunteers for this opportunity
            let opportunityVolunteers = 0;
            if (opp.applications && opp.applications.length > 0) {
                opportunityVolunteers = opp.applications.filter(
                    app => app.status === 'Accepted'
                ).length;
                totalVolunteers += opportunityVolunteers;
            }
            
            // Check if opportunity is completed based on end date
            let isCompleted = false;
            if (opp.schedule && opp.schedule.endDate) {
                const endDate = new Date(opp.schedule.endDate);
                isCompleted = endDate < currentDate;
                if (isCompleted) {
                    completedProjects += 1;
                }
            }
            
            // Convert to plain object to add custom property
            const oppObj = opp.toObject();
            oppObj.isCompleted = isCompleted;
            oppObj.volunteersCount = opportunityVolunteers;
            
            return oppObj;
        });
        
        // Combine all data for the dashboard
        const dashboardData = {
            profile: {
                _id: authProvider._id,
                email: authProvider.contactPerson?.email,
                phone: authProvider.contactPerson?.phoneNumber,
                organizationName: authProvider.organizationName,
                profileCompletion: { 
                    step1: authProvider.profileStatus === 'STEP_1' || authProvider.profileStatus === 'STEP_2' || authProvider.profileStatus === 'COMPLETED',
                    step2: authProvider.profileStatus === 'STEP_2' || authProvider.profileStatus === 'COMPLETED'
                },
                organizationDetails: providerProfile ? {
                    logo: providerProfile.organizationDetails?.logo || null,
                    description: providerProfile.organizationDetails?.description || '',
                    website: providerProfile.organizationDetails?.website || '',
                    location: providerProfile.organizationDetails?.location || {}
                } : null
            },
            stats: {
                totalOpportunities,
                totalVolunteers,
                completedProjects
            },
            opportunities: processedOpportunities
        };
        
        return res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Error getting provider dashboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get provider dashboard data',
            error: error.message
        });
    }
};