// filepath: d:\Enveave-SDOS\api\controllers\application.controller.js
import mongoose from 'mongoose';
import Opportunity from '../models/opportunity.model.js';
import Volunteer from '../models/volunteer.model.js';
import OpportunityProvider from '../models/opportunityprovider.model.js';
import AuthVolunteer from '../models/auth.volunteer.model.js';
import { sanitizeNestedObject } from '../helpers/securityHelper.js';

/**
 * Get all applications (admin access)
 * @route GET /api/applications
 * @access Private - Admin only
 */
export const getAllApplications = async (req, res) => {
    try {
        // Check if user is admin (you may need to adjust this based on your authentication middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin access required.' });
        }
        
        // Get all volunteers with their applications
        const volunteers = await Volunteer.find()
            .populate({
                path: 'appliedOpportunities.opportunity',
                populate: {
                    path: 'provider',
                    populate: {
                        path: 'auth',
                        select: 'organizationName -_id'
                    }
                }
            });
        
        // Extract all applications from all volunteers
        const applications = [];
        
        volunteers.forEach(volunteer => {
            if (volunteer.appliedOpportunities && volunteer.appliedOpportunities.length > 0) {
                volunteer.appliedOpportunities.forEach(app => {
                    applications.push({
                        _id: app._id,
                        volunteer: {
                            _id: volunteer._id,
                            name: volunteer.auth ? volunteer.auth.name : 'Unknown Volunteer',
                            profilePhoto: volunteer.profilePhoto
                        },
                        opportunity: app.opportunity,
                        status: app.status,
                        isCompleted: app.isCompleted,
                        completionDate: app.completionDate,
                        appliedAt: app.appliedAt
                    });
                });
            }
        });
        
        res.status(200).json({
            message: 'Applications retrieved successfully',
            data: applications
        });
    } catch (error) {
        console.error('Error in getAllApplications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get applications for a specific opportunity (provider access)
 * @route GET /api/applications/opportunity/:opportunityId
 * @access Private - Provider who owns the opportunity
 */
export const getOpportunityApplications = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(400).json({ message: 'Invalid opportunity ID' });
        }
        
        // Check if user is authenticated and is a provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Provider access required.' });
        }
        
        // Find the opportunity
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Find the provider using auth ID from token
        const provider = await OpportunityProvider.findOne({ auth: req.user.id });
        if (!provider) {
            return res.status(404).json({ message: 'Provider profile not found' });
        }
        
        // Verify that this provider owns the opportunity
        if (opportunity.provider.toString() !== provider._id.toString()) {
            return res.status(403).json({ message: 'Access denied. You do not own this opportunity.' });
        }
        
        // Get applications for this opportunity
        const applications = [];
        
        // Populate applicants from the opportunity document
        await opportunity.populate({
            path: 'applicants.volunteer',
            select: 'auth profilePhoto',
            populate: {
                path: 'auth',
                select: 'name email -_id'
            }
        });
        
        // Transform the applicants data into a more usable format
        opportunity.applicants.forEach(app => {
            applications.push({
                _id: app._id,
                volunteer: app.volunteer,
                status: app.status,
                appliedAt: app.appliedAt
            });
        });
        
        // Also search for the corresponding volunteer records to get completion status
        const volunteers = await Volunteer.find({
            'appliedOpportunities.opportunity': mongoose.Types.ObjectId(opportunityId)
        }).select('appliedOpportunities');
        
        // Merge completion data with applications
        applications.forEach(app => {
            const matchingVolunteer = volunteers.find(v => {
                const matchingApp = v.appliedOpportunities.find(a => 
                    a.opportunity.toString() === opportunityId && 
                    a.status === app.status && 
                    a.volunteer?.toString() === app.volunteer?._id?.toString()
                );
                if (matchingApp) {
                    app.isCompleted = matchingApp.isCompleted;
                    app.completionDate = matchingApp.completionDate;
                    return true;
                }
                return false;
            });
        });
        
        res.status(200).json({
            message: 'Opportunity applications retrieved successfully',
            data: applications
        });
    } catch (error) {
        console.error('Error in getOpportunityApplications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get volunteer's own applications
 * @route GET /api/applications/user
 * @access Private - Volunteer access only
 */
export const getUserApplications = async (req, res) => {
    try {
        // Check if user is authenticated and is a volunteer
        if (!req.user || req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Access denied. Volunteer access required.' });
        }
        
        // Find the volunteer profile using auth ID from token
        const volunteer = await Volunteer.findOne({ auth: req.user.id })
            .populate({
                path: 'appliedOpportunities.opportunity',
                populate: {
                    path: 'provider',
                    populate: {
                        path: 'auth',
                        select: 'organizationName -_id'
                    }
                }
            });
        
        // Modified: Return empty array instead of 404 if volunteer profile doesn't exist yet
        if (!volunteer) {
            console.log(`Volunteer profile not found for auth ID: ${req.user.id}. Returning empty applications array.`);
            return res.status(200).json({
                message: 'No volunteer profile found. Complete your profile to apply for opportunities.',
                data: []
            });
        }
        
        // Return the volunteer's applications
        const applications = volunteer.appliedOpportunities || [];
        
        res.status(200).json({
            message: 'Your applications retrieved successfully',
            data: applications
        });
    } catch (error) {
        console.error('Error in getUserApplications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get application by ID
 * @route GET /api/applications/:id
 * @access Private - Admin, Provider who owns the opportunity, or Volunteer who applied
 */
export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }
        
        // Find the volunteer with this application
        const volunteer = await Volunteer.findOne({ 
            'appliedOpportunities._id': mongoose.Types.ObjectId(id) 
        }).populate({
            path: 'appliedOpportunities.opportunity',
            populate: {
                path: 'provider',
                populate: {
                    path: 'auth',
                    select: 'organizationName contactPerson.email -_id'
                }
            }
        });
        
        if (!volunteer) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Find the specific application
        const application = volunteer.appliedOpportunities.find(app => 
            app._id.toString() === id
        );
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Check authorization
        if (req.user.role === 'admin') {
            // Admin can view any application
        } else if (req.user.role === 'provider') {
            // Provider can only view applications for their opportunities
            const provider = await OpportunityProvider.findOne({ auth: req.user.id });
            if (!provider) {
                return res.status(404).json({ message: 'Provider profile not found' });
            }
            
            // Check if this provider owns the opportunity
            const opportunity = await Opportunity.findById(application.opportunity);
            if (!opportunity || opportunity.provider.toString() !== provider._id.toString()) {
                return res.status(403).json({ message: 'Access denied. You do not own this opportunity.' });
            }
        } else if (req.user.role === 'volunteer') {
            // Volunteer can only view their own applications
            if (volunteer.auth.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied. This is not your application.' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        res.status(200).json({
            message: 'Application retrieved successfully',
            data: application
        });
    } catch (error) {
        console.error('Error in getApplicationById:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Submit new application
 * @route POST /api/applications
 * @access Private - Volunteer only
 */
export const submitApplication = async (req, res) => {
    try {
        // Check if user is authenticated and is a volunteer
        if (!req.user || req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Access denied. Volunteer access required.' });
        }
        
        const { opportunityId } = req.body;
        
        // Validate input
        if (!opportunityId) {
            return res.status(400).json({ message: 'Opportunity ID is required' });
        }
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(400).json({ message: 'Invalid opportunity ID' });
        }
        
        // Find the volunteer profile
        const volunteer = await Volunteer.findOne({ auth: req.user.id });
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        
        // Check if the opportunity exists
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Check if the application deadline has passed
        const currentDate = new Date();
        if (opportunity.schedule.applicationDeadline && new Date(opportunity.schedule.applicationDeadline) < currentDate) {
            return res.status(400).json({ message: 'Application deadline has passed' });
        }
        
        // Check if the volunteer has already applied to this opportunity
        const hasApplied = volunteer.appliedOpportunities.some(app => 
            app.opportunity.toString() === opportunityId
        );
        
        if (hasApplied) {
            return res.status(400).json({ message: 'You have already applied to this opportunity' });
        }
        
        // Create new application
        const newApplication = {
            opportunity: opportunityId,
            status: 'Pending',
            isCompleted: false,
            appliedAt: new Date()
        };
        
        // Add application to volunteer's applied opportunities
        volunteer.appliedOpportunities.push(newApplication);
        await volunteer.save();
        
        // Get the newly created application from the saved volunteer
        const savedApplication = volunteer.appliedOpportunities[volunteer.appliedOpportunities.length - 1];
        
        // Add volunteer to opportunity's applicants
        opportunity.applicants.push({
            volunteer: volunteer._id,
            status: 'Pending',
            appliedAt: new Date()
        });
        await opportunity.save();
        
        // Populate the application with opportunity details for the response
        await volunteer.populate({
            path: 'appliedOpportunities.opportunity',
            match: { _id: opportunityId },
            populate: {
                path: 'provider',
                populate: {
                    path: 'auth',
                    select: 'organizationName -_id'
                }
            }
        });
        
        // Find the populated application
        const populatedApplication = volunteer.appliedOpportunities.find(app => 
            app._id.toString() === savedApplication._id.toString()
        );
        
        res.status(201).json({
            message: 'Application submitted successfully',
            data: populatedApplication
        });
    } catch (error) {
        console.error('Error in submitApplication:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update application status (approve/reject)
 * @route PATCH /api/applications/:id/status
 * @access Private - Provider who owns the opportunity
 */
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedbackNote } = req.body;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }
        
        // Validate input
        if (!status || !['Accepted', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Valid status required (Accepted, Rejected, or Pending)' });
        }
        
        // Check if user is authenticated and is a provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Access denied. Provider access required.' });
        }
        
        // Find the volunteer with this application
        const volunteer = await Volunteer.findOne({ 'appliedOpportunities._id': mongoose.Types.ObjectId(id) });
        if (!volunteer) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Find the application
        const applicationIndex = volunteer.appliedOpportunities.findIndex(app => 
            app._id.toString() === id
        );
        
        if (applicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const application = volunteer.appliedOpportunities[applicationIndex];
        
        // Find the opportunity
        const opportunity = await Opportunity.findById(application.opportunity);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Find the provider
        const provider = await OpportunityProvider.findOne({ auth: req.user.id });
        if (!provider) {
            return res.status(404).json({ message: 'Provider profile not found' });
        }
        
        // Check if this provider owns the opportunity
        if (opportunity.provider.toString() !== provider._id.toString()) {
            return res.status(403).json({ message: 'Access denied. You do not own this opportunity.' });
        }
        
        // Update application status in volunteer record
        volunteer.appliedOpportunities[applicationIndex].status = status;
        if (feedbackNote) {
            volunteer.appliedOpportunities[applicationIndex].feedbackNote = feedbackNote;
        }
        
        await volunteer.save();
        
        // Update status in opportunity's applicants array
        const applicantIndex = opportunity.applicants.findIndex(app => 
            app.volunteer.toString() === volunteer._id.toString()
        );
        
        if (applicantIndex !== -1) {
            opportunity.applicants[applicantIndex].status = status;
            await opportunity.save();
        }
        
        // If accepted, increment provider's total volunteers count
        if (status === 'Accepted') {
            await OpportunityProvider.findByIdAndUpdate(
                provider._id,
                { $inc: { totalVolunteers: 1 } }
            );
        }
        
        res.status(200).json({
            message: 'Application status updated successfully',
            data: volunteer.appliedOpportunities[applicationIndex]
        });
    } catch (error) {
        console.error('Error in updateApplicationStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update application completion status
 * @route PATCH /api/applications/:id/complete
 * @access Private - Volunteer who owns the application or Provider who owns the opportunity
 */
export const updateCompletionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }
        
        // Validate input
        if (isCompleted === undefined) {
            return res.status(400).json({ message: 'isCompleted field is required' });
        }
        
        // Find the volunteer with this application
        const volunteer = await Volunteer.findOne({ 'appliedOpportunities._id': mongoose.Types.ObjectId(id) });
        if (!volunteer) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Find the application
        const applicationIndex = volunteer.appliedOpportunities.findIndex(app => 
            app._id.toString() === id
        );
        
        if (applicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const application = volunteer.appliedOpportunities[applicationIndex];
        
        // Find the opportunity
        const opportunity = await Opportunity.findById(application.opportunity);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Check authorization
        if (req.user.role === 'volunteer') {
            // Volunteer can only update their own applications
            if (volunteer.auth.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied. This is not your application.' });
            }
        } else if (req.user.role === 'provider') {
            // Provider can only update applications for their opportunities
            const provider = await OpportunityProvider.findOne({ auth: req.user.id });
            if (!provider) {
                return res.status(404).json({ message: 'Provider profile not found' });
            }
            
            // Check if this provider owns the opportunity
            if (opportunity.provider.toString() !== provider._id.toString()) {
                return res.status(403).json({ message: 'Access denied. You do not own this opportunity.' });
            }
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }
        
        // Check if application is accepted (can only mark accepted applications as completed)
        if (application.status !== 'Accepted') {
            return res.status(400).json({ message: 'Only accepted applications can be marked as completed' });
        }
        
        // Update completion status
        volunteer.appliedOpportunities[applicationIndex].isCompleted = isCompleted;
        
        // If marking as completed, set completion date
        if (isCompleted) {
            volunteer.appliedOpportunities[applicationIndex].completionDate = new Date();
        } else {
            volunteer.appliedOpportunities[applicationIndex].completionDate = null;
        }
        
        await volunteer.save();
        
        res.status(200).json({
            message: 'Application completion status updated successfully',
            data: volunteer.appliedOpportunities[applicationIndex]
        });
    } catch (error) {
        console.error('Error in updateCompletionStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Withdraw application
 * @route DELETE /api/applications/:id
 * @access Private - Volunteer who owns the application
 */
export const withdrawApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }
        
        // Check if user is authenticated and is a volunteer
        if (!req.user || req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Access denied. Volunteer access required.' });
        }
        
        // Find the volunteer
        const volunteer = await Volunteer.findOne({ auth: req.user.id });
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        
        // Find the application
        const applicationIndex = volunteer.appliedOpportunities.findIndex(app => 
            app._id.toString() === id
        );
        
        if (applicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const application = volunteer.appliedOpportunities[applicationIndex];
        
        // Can only withdraw pending applications
        if (application.status !== 'Pending') {
            return res.status(400).json({ 
                message: 'Only pending applications can be withdrawn. Contact the opportunity provider for accepted applications.' 
            });
        }
        
        // Get opportunity ID before removing the application
        const opportunityId = application.opportunity;
        
        // Remove application from volunteer's applications array
        volunteer.appliedOpportunities.splice(applicationIndex, 1);
        await volunteer.save();
        
        // Remove volunteer from opportunity's applicants array
        await Opportunity.findByIdAndUpdate(
            opportunityId,
            { 
                $pull: { 
                    applicants: { volunteer: volunteer._id } 
                } 
            }
        );
        
        res.status(200).json({
            message: 'Application withdrawn successfully'
        });
    } catch (error) {
        console.error('Error in withdrawApplication:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Register for an opportunity
 * @route POST /api/applications/register
 * @access Private - Only authenticated volunteers
 */
export const registerForOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.body;
        
        // Validate input
        if (!opportunityId) {
            return res.status(400).json({ message: 'Opportunity ID is required' });
        }
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(400).json({ message: 'Invalid opportunity ID format' });
        }
        
        // Check if user is authenticated and is a volunteer
        if (!req.user || req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Access denied. Only volunteers can register for opportunities' });
        }
        
        // Find opportunity first to validate it exists and is open
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Check if opportunity registration is open (not closed)
        const currentDate = new Date();
        if (opportunity.schedule.applicationDeadline && new Date(opportunity.schedule.applicationDeadline) < currentDate) {
            return res.status(400).json({ message: 'Registration for this opportunity has closed' });
        }
        
        // Find volunteer profile using auth user ID
        const volunteer = await Volunteer.findOne({ auth: req.user.id });
        if (!volunteer) {
            // Try to get volunteer's name from auth record for better error messaging
            const authVolunteer = await AuthVolunteer.findById(req.user.id);
            const volunteerName = authVolunteer ? authVolunteer.name : 'Volunteer';
            
            return res.status(404).json({ 
                message: `${volunteerName}'s profile not complete. Please complete your profile before registering.`,
                code: 'PROFILE_INCOMPLETE'
            });
        }
        
        // Check if profile is complete
        const { step1, step2, step3 } = volunteer.profileCompletion;
        if (!step1 || !step2 || !step3) {
            return res.status(400).json({ 
                message: 'Your profile is incomplete. Please complete all profile steps before registering.',
                code: 'PROFILE_INCOMPLETE',
                completedSteps: { step1, step2, step3 }
            });
        }
        
        // Check if volunteer has already registered for this opportunity
        const alreadyRegistered = volunteer.appliedOpportunities.some(application => 
            application.opportunity.toString() === opportunityId
        );
        
        if (alreadyRegistered) {
            return res.status(400).json({ 
                message: 'You have already registered for this opportunity',
                code: 'ALREADY_REGISTERED'
            });
        }
        
        // Check if opportunity has reached maximum volunteer limit
        if (opportunity.basicDetails.volunteersRequired) {
            // Count accepted applicants
            const acceptedApplicants = opportunity.applicants.filter(applicant => 
                applicant.status === 'Accepted'
            ).length;
            
            if (acceptedApplicants >= opportunity.basicDetails.volunteersRequired) {
                return res.status(400).json({ 
                    message: 'This opportunity has reached its maximum number of volunteers',
                    code: 'MAX_VOLUNTEERS_REACHED'
                });
            }
        }
        
        // Create a new registration/application entry
        const newApplication = {
            opportunity: opportunityId,
            status: 'Pending',
            isCompleted: false,
            appliedAt: new Date()
        };
        
        // Add application to volunteer record
        volunteer.appliedOpportunities.push(newApplication);
        await volunteer.save();
        
        // Get the saved application with its generated _id
        const savedApplication = volunteer.appliedOpportunities.find(app => 
            app.opportunity.toString() === opportunityId
        );
        
        // Also add volunteer to opportunity's applicants list
        opportunity.applicants.push({
            volunteer: volunteer._id,
            status: 'Pending',
            appliedAt: new Date()
        });
        await opportunity.save();
        
        // Populate the application with opportunity details for better response
        await Volunteer.populate(volunteer, {
            path: 'appliedOpportunities.opportunity',
            match: { _id: opportunityId },
            select: 'basicDetails schedule provider',
            populate: {
                path: 'provider',
                select: 'auth',
                populate: {
                    path: 'auth',
                    select: 'organizationName'
                }
            }
        });
        
        // Get the fully populated application
        const populatedApplication = volunteer.appliedOpportunities.find(app => 
            app._id.toString() === savedApplication._id.toString()
        );
        
        res.status(201).json({
            message: 'Successfully registered for the opportunity',
            data: populatedApplication
        });
    } catch (error) {
        console.error('Error in registerForOpportunity:', error);
        res.status(500).json({ 
            message: 'Server error while registering for opportunity', 
            error: error.message 
        });
    }
};