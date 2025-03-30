import Opportunity from "../models/opportunity.model.js";
import OpportunityProvider from "../models/opportunityprovider.model.js";
import { sanitizeNestedObject } from "../helpers/securityHelper.js";
import mongoose from "mongoose";
import Joi from "joi";
import { upload, uploadImageToCloudinary } from "../helpers/imageUpload.js";

/**
 * Get all opportunities
 * @route GET /api/opportunities
 * @access Public
 */
export const getAllOpportunities = async (req, res) => {
    try {
        const { sort, filter, search, limit, page } = req.query;
        const queryOptions = {};
        const sortOptions = {};
        
        // Pagination
        const pageNum = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNum - 1) * pageSize;
        
        // Filtering options
        if (filter) {
            const filterObj = JSON.parse(filter);
            
            // Filter by opportunity type
            if (filterObj.opportunityType) {
                queryOptions['basicDetails.opportunityType'] = filterObj.opportunityType;
            }
            
            // Filter by category
            if (filterObj.category) {
                queryOptions['basicDetails.category.name'] = filterObj.category;
            }
            
            // Filter by location
            if (filterObj.location) {
                queryOptions['schedule.location'] = { $regex: filterObj.location, $options: 'i' };
            }
            
            // Filter by paid/unpaid
            if (filterObj.isPaid !== undefined) {
                queryOptions['basicDetails.isPaid'] = filterObj.isPaid;
            }
        }
        
        // Search functionality
        if (search) {
            const sanitizedSearch = sanitizeNestedObject({ search }).search;
            queryOptions['$or'] = [
                { 'basicDetails.title': { $regex: sanitizedSearch, $options: 'i' } },
                { 'basicDetails.description': { $regex: sanitizedSearch, $options: 'i' } }
            ];
        }
        
        // Sorting
        if (sort) {
            const sortObj = JSON.parse(sort);
            
            // Sort by date
            if (sortObj.date) {
                sortOptions['schedule.startDate'] = sortObj.date === 'asc' ? 1 : -1;
            }
            
            // Sort by compensation
            if (sortObj.compensation) {
                sortOptions['basicDetails.compensation'] = sortObj.compensation === 'asc' ? 1 : -1;
            }
            
            // Sort by creation date
            if (sortObj.createdAt) {
                sortOptions['createdAt'] = sortObj.createdAt === 'asc' ? 1 : -1;
            }
        } else {
            // Default sort by newest first
            sortOptions['createdAt'] = -1;
        }
        
        // Execute query with pagination
        const opportunities = await Opportunity.find(queryOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize)
            .populate({
                path: 'provider',
                select: 'organizationDetails.logo organizationDetails.description',
                populate: {
                    path: 'auth',
                    select: 'organizationName contactPerson.email -_id'
                }
            });
        
        // Get total count for pagination info
        const totalCount = await Opportunity.countDocuments(queryOptions);
        
        res.status(200).json({
            message: 'Opportunities retrieved successfully',
            data: {
                opportunities,
                pagination: {
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    currentPage: pageNum,
                    pageSize
                }
            }
        });
    } catch (error) {
        console.error('Error in getAllOpportunities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get latest 3 opportunities
 * @route GET /api/opportunities/latest
 * @access Public
 */
export const getLatestOpportunities = async (req, res) => {
    try {
        const latestOpportunities = await Opportunity.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate({
                path: 'provider',
                select: 'organizationDetails.logo organizationDetails.description',
                populate: {
                    path: 'auth',
                    select: 'organizationName contactPerson.email -_id'
                }
            });
        
        if (!latestOpportunities.length) {
            return res.status(404).json({ message: 'No opportunities found' });
        }
        
        res.status(200).json({
            message: 'Latest opportunities retrieved successfully',
            data: latestOpportunities
        });
    } catch (error) {
        console.error('Error in getLatestOpportunities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get opportunities with cursor-based pagination for infinite scrolling
 * @route GET /api/opportunities/feed
 * @access Public
 */
export const getOpportunitiesFeed = async (req, res) => {
    try {
        const { limit = 5, cursor, filter, search } = req.query;
        const pageSize = parseInt(limit);
        const queryOptions = {};
        
        // Implement cursor-based pagination for efficient infinite scrolling
        if (cursor) {
            queryOptions._id = { $lt: cursor };
        }
        
        // Apply filtering if provided
        if (filter) {
            try {
                const filterObj = JSON.parse(filter);
                
                if (filterObj.opportunityType) {
                    queryOptions['basicDetails.opportunityType'] = filterObj.opportunityType;
                }
                
                if (filterObj.category) {
                    queryOptions['basicDetails.category.name'] = filterObj.category;
                }
                
                if (filterObj.location) {
                    queryOptions['schedule.location'] = { $regex: filterObj.location, $options: 'i' };
                }
                
                if (filterObj.isPaid !== undefined) {
                    queryOptions['basicDetails.isPaid'] = filterObj.isPaid;
                }
            } catch (error) {
                console.error('Error parsing filter JSON:', error);
                // Continue with the request even if filter parsing fails
            }
        }
        
        // Apply search if provided
        if (search) {
            const sanitizedSearch = sanitizeNestedObject({ search }).search;
            queryOptions['$or'] = [
                { 'basicDetails.title': { $regex: sanitizedSearch, $options: 'i' } },
                { 'basicDetails.description': { $regex: sanitizedSearch, $options: 'i' } }
            ];
        }
        
        // Fetch one more than requested to determine if there are more results
        const opportunities = await Opportunity.find(queryOptions)
            .sort({ _id: -1 }) // Sort by _id for consistent cursor-based pagination
            .limit(pageSize + 1)
            .populate({
                path: 'provider',
                select: 'organizationDetails.logo organizationDetails.description',
                populate: {
                    path: 'auth',
                    select: 'organizationName contactPerson.email -_id'
                }
            });
        
        // Check if there are more results
        const hasNextPage = opportunities.length > pageSize;
        if (hasNextPage) {
            opportunities.pop(); // Remove the extra item
        }
        
        // Get the next cursor (if available)
        const nextCursor = hasNextPage ? opportunities[opportunities.length - 1]._id : null;
        
        res.status(200).json({
            message: 'Opportunities feed retrieved successfully',
            data: {
                opportunities,
                pageInfo: {
                    hasNextPage,
                    nextCursor: nextCursor?.toString(),
                    count: opportunities.length
                }
            }
        });
    } catch (error) {
        console.error('Error in getOpportunitiesFeed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Create a new opportunity
 * @route POST /api/opportunities
 * @access Private - Only authenticated opportunity providers
 */
export const createOpportunity = async (req, res) => {
    try {
        // Check if user is authenticated and is an opportunity provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Only opportunity providers can create opportunities' });
        }

        // Handle image upload if present
        let imageUrl = '';
        if (req.file) {
            try {
                imageUrl = await uploadImageToCloudinary(
                    req.file.buffer,
                    'opportunities'
                );
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }

        // Validate the opportunity data
        const opportunitySchema = Joi.object({
            basicDetails: Joi.object({
                title: Joi.string().required().trim().max(200),
                description: Joi.string().required().trim().max(2000),
                photo: Joi.string().uri().allow('').optional(),
                opportunityType: Joi.string().required().valid(
                    'One-time Event',
                    'Short-term Volunteering (1-4 weeks)',
                    'Medium-term Volunteering (1-6 months)',
                    'Long-term Volunteering (6+ months)',
                    'Other'
                ),
                category: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        customCategory: Joi.string().when('name', {
                            is: 'Other',
                            then: Joi.required(),
                            otherwise: Joi.optional()
                        })
                    })
                ).min(1).required(),
                volunteersRequired: Joi.number().integer().min(1).required(),
                isPaid: Joi.boolean().required(),
                compensation: Joi.number().when('isPaid', {
                    is: true,
                    then: Joi.required(),
                    otherwise: Joi.optional()
                })
            }).required(),
            schedule: Joi.object({
                location: Joi.string().required(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required().greater(Joi.ref('startDate')),
                timeCommitment: Joi.string().required().valid(
                    'Few hours per week',
                    '1-2 days per week',
                    '3-4 days per week',
                    'Full-time'
                ),
                contactPerson: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    phoneNumber: Joi.string().required()
                }).required()
            }).required(),
            evaluation: Joi.object({
                support: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        customSupport: Joi.string().when('name', {
                            is: 'Other',
                            then: Joi.required(),
                            otherwise: Joi.optional()
                        })
                    })
                ).required(),
                hasMilestones: Joi.boolean().required(),
                milestones: Joi.array().when('hasMilestones', {
                    is: true,
                    then: Joi.array().items(
                        Joi.object({
                            question: Joi.string().required(),
                            expectedAnswer: Joi.boolean().required()
                        })
                    ).min(1).required(),
                    otherwise: Joi.optional()
                })
            }).required(),
            additionalInfo: Joi.object({
                resources: Joi.string().allow('').optional(),
                consentAgreement: Joi.boolean().required().valid(true)
            }).required()
        });

        const { error } = opportunitySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        // Sanitize input data
        const sanitizedData = sanitizeNestedObject(req.body);
        
        // Add the image URL if an image was uploaded
        if (imageUrl) {
            sanitizedData.basicDetails.photo = imageUrl;
        }
        
        // Find the provider profile using auth ID from token
        const provider = await OpportunityProvider.findOne({ auth: req.user.id });
        if (!provider) {
            return res.status(404).json({ message: 'Opportunity provider profile not found' });
        }
        
        // Create new opportunity
        const newOpportunity = new Opportunity({
            provider: provider._id,
            ...sanitizedData,
            profileCompletion: {
                step1: true,
                step2: true,
                step3: true,
                step4: true
            }
        });
        
        const savedOpportunity = await newOpportunity.save();
        
        // Update provider's posted opportunities
        await OpportunityProvider.findByIdAndUpdate(
            provider._id,
            { $push: { postedOpportunities: savedOpportunity._id } }
        );
        
        res.status(201).json({
            message: 'Opportunity created successfully',
            data: savedOpportunity
        });
    } catch (error) {
        console.error('Error in createOpportunity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Update an existing opportunity
 * @route PUT /api/opportunities/:id
 * @access Private - Only the opportunity provider who created it
 */
export const updateOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid opportunity ID' });
        }
        
        // Check if user is authenticated and is an opportunity provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Only opportunity providers can update opportunities' });
        }
        
        // Find the opportunity
        const opportunity = await Opportunity.findById(id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Find the provider profile using auth ID from token
        const provider = await OpportunityProvider.findOne({ auth: req.user.id });
        if (!provider) {
            return res.status(404).json({ message: 'Opportunity provider profile not found' });
        }
        
        // Check if this provider owns the opportunity
        if (opportunity.provider.toString() !== provider._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this opportunity' });
        }
        
        // Handle image upload if present
        if (req.file) {
            try {
                const imageUrl = await uploadImageToCloudinary(
                    req.file.buffer,
                    'opportunities'
                );
                
                // Add the image URL to the body data
                if (!req.body.basicDetails) {
                    req.body.basicDetails = {};
                }
                req.body.basicDetails.photo = imageUrl;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({ message: 'Error uploading image', error: uploadError.message });
            }
        }
        
        // Clean up the update data to handle empty objects and invalid dates
        const cleanData = cleanUpdateData(req.body);
        
        // Sanitize input data
        const sanitizedData = sanitizeNestedObject(cleanData);
        
        // Update the opportunity with direct MongoDB update to bypass Mongoose validation
        const result = await mongoose.connection.collection('opportunities').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: sanitizedData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Fetch the updated document
        const updatedOpportunity = await Opportunity.findById(id);
        
        res.status(200).json({
            message: 'Opportunity updated successfully',
            data: updatedOpportunity
        });
    } catch (error) {
        console.error('Error in updateOpportunity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Helper function to clean update data and handle empty objects and invalid dates
 */
function cleanUpdateData(data) {
    // Create a deep copy to avoid modifying the original
    const cleaned = JSON.parse(JSON.stringify(data));
    
    // Recursively process the data object
    function processObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        
        // Process each property in the object
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            
            // Check if the value is an empty object
            if (value && typeof value === 'object' && Object.keys(value).length === 0) {
                delete obj[key]; // Remove empty objects
                return;
            }
            
            // If the key suggests this might be a date field and it's a string, validate it
            if ((key.toLowerCase().includes('date') || key === 'startDate' || key === 'endDate') 
                && typeof value === 'string') {
                try {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        obj[key] = date; // Valid date, convert string to Date object
                    } else {
                        delete obj[key]; // Invalid date string, remove it
                    }
                } catch (e) {
                    delete obj[key]; // Error parsing date, remove it
                }
                return;
            }
            
            // Recursively process nested objects (but not arrays)
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                processObject(value);
                
                // If after processing, the object is empty, remove it
                if (Object.keys(value).length === 0) {
                    delete obj[key];
                }
            }
        });
        
        return obj;
    }
    
    return processObject(cleaned);
}

/**
 * Delete an opportunity
 * @route DELETE /api/opportunities/:id
 * @access Private - Only the opportunity provider who created it
 */
export const deleteOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid opportunity ID' });
        }
        
        // Check if user is authenticated and is an opportunity provider
        if (!req.user || req.user.role !== 'provider') {
            return res.status(403).json({ message: 'Only opportunity providers can delete opportunities' });
        }
        
        // Find the opportunity
        const opportunity = await Opportunity.findById(id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Find the provider profile using auth ID from token
        const provider = await OpportunityProvider.findOne({ auth: req.user.id });
        if (!provider) {
            return res.status(404).json({ message: 'Opportunity provider profile not found' });
        }
        
        // Check if this provider owns the opportunity
        if (opportunity.provider.toString() !== provider._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this opportunity' });
        }
        
        // Check if there are any applicants already
        if (opportunity.applicants && opportunity.applicants.length > 0) {
            // Option: Instead of preventing deletion, we could add a "isArchived" flag
            // But for now, let's prevent deletion if there are applicants
            return res.status(400).json({ 
                message: 'Cannot delete an opportunity that has active applicants',
                applicantsCount: opportunity.applicants.length
            });
        }
        
        // Remove the opportunity from provider's postedOpportunities array
        await OpportunityProvider.findByIdAndUpdate(
            provider._id,
            { $pull: { postedOpportunities: opportunity._id } }
        );
        
        // Delete the opportunity
        await Opportunity.findByIdAndDelete(id);
        
        res.status(200).json({
            message: 'Opportunity deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteOpportunity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};