import { z } from 'zod';

// Validation schema for Step 1: Basic Details
export const basicDetailsSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),
  photo: z.any().optional(),
  opportunityType: z.enum([
    'One-time Event',
    'Short-term Volunteering (1-4 weeks)',
    'Medium-term Volunteering (1-6 months)',
    'Long-term Volunteering (6+ months)',
    'Other'
  ], {
    errorMap: () => ({ message: "Please select an opportunity type" })
  }),
  category: z.array(
    z.object({      name: z.enum([
        'Content Creation & Communication',
        'Field Work & Conservation',
        'Research & Data Collection',
        'Education & Awareness',
        'Administrative Support',
        'Event Management',
        'Technical & IT Support',
        'Fundraising & Grant Writing',
        'Community Outreach',
        'Project Coordination',
        'Waste Management',
        'Sustainability Planning',
        'Wildlife Protection',
        'Climate Action',
        'Other'
      ]),
      customCategory: z.string().optional().superRefine(
        (val, ctx) => {
          // Safely check if parent exists and name is 'Other'
          const isOther = ctx.path && ctx.path.length > 1 && ctx.parent?.name === 'Other';
          
          if (isOther && (!val || val.trim() === '')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Custom category is required when 'Other' is selected"
            });
          }
          return z.NEVER;
        }
      )
    })
  ).min(1, "At least one category must be selected"),
  volunteersRequired: z.number()
    .int("Must be a whole number")
    .min(1, "At least 1 volunteer is required"),  isPaid: z.boolean(),
  compensation: z.number().optional().superRefine(
    (val, ctx) => {
      // Safely check if parent exists and isPaid is true
      const isPaid = ctx.path && ctx.path.length > 1 ? 
        ctx.parent?.isPaid : false;
      
      if (isPaid && (val === undefined || val <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Compensation amount is required for paid opportunities"
        });
      }
      return z.NEVER;
    }
  )
});

// Validation schema for Step 2: Schedule
export const scheduleSchema = z.object({
  location: z.string().min(3, "Location must be at least 3 characters long"),
  startDate: z.string()
    .refine(date => !isNaN(new Date(date).getTime()), {
      message: "Start date must be a valid date"
    }),
  endDate: z.string()
    .refine(date => !isNaN(new Date(date).getTime()), {
      message: "End date must be a valid date"
    })
    .superRefine((date, ctx) => {
      // Only run comparison if we have both dates and they're valid
      const startDate = ctx.path && ctx.path.length > 0 && ctx.data?.startDate ? 
        new Date(ctx.data.startDate) : null;
      const endDate = date ? new Date(date) : null;
      
      if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
        if (endDate <= startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date"
          });
        }
      }
      return z.NEVER;
    }),
  applicationDeadline: z.string()
    .refine(date => !isNaN(new Date(date).getTime()), {
      message: "Application deadline must be a valid date"
    })
    .superRefine((date, ctx) => {
      // Only run comparison if we have both dates and they're valid
      const startDate = ctx.path && ctx.path.length > 0 && ctx.data?.startDate ? 
        new Date(ctx.data.startDate) : null;
      const deadlineDate = date ? new Date(date) : null;
      
      if (startDate && deadlineDate && !isNaN(startDate) && !isNaN(deadlineDate)) {
        if (deadlineDate > startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Application deadline must be on or before start date"
          });
        }
      }
      return z.NEVER;
    }),
  timeCommitment: z.enum([
    'Few hours per week',
    '1-2 days per week',
    '3-4 days per week',
    'Full-time'
  ], {
    errorMap: () => ({ message: "Please select a time commitment" })
  }),
  contactPerson: z.object({
    name: z.string().min(2, "Contact person name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number")
  })
});

// Validation schema for Step 3: Support and Milestones
export const evaluationSchema = z.object({
  support: z.array(
    z.object({
      name: z.enum([
        'Travel Reimbursement',
        'Food & Accommodation',
        'Certificate of Participation',
        'Letter of Recommendation',
        'Stipend/Monetary Incentive',
        'Learning/Training Sessions',
        'Networking Opportunities',
        'Other'
      ]),
      customSupport: z.string().optional().superRefine((val, ctx) => {
        // Check if we can extract the parent object
        const path = ctx.path;
        // Try to access the name property from the current context
        if (path && path.length > 0) {
          // Check if ctx.path includes information about the current object
          const nameValue = path.length >= 2 && ctx.data?.name;
          if (nameValue === 'Other' && (!val || val.trim() === '')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Custom support type is required when 'Other' is selected"
            });
          }
        }
        return z.NEVER;
      })
    })
  ).min(1, "At least one support type must be selected"),
  hasMilestones: z.boolean().default(false),
  milestones: z.union([
    z.array(
      z.object({
        question: z.string().min(5, "Milestone question is required"),
        expectedAnswer: z.boolean()
      })
    ).min(1, "At least one milestone is required when milestones are enabled"),
    z.array(z.object({})).max(0)
  ]).superRefine((val, ctx) => {
    // Only validate if hasMilestones is true
    if (ctx.data?.hasMilestones === true) {
      if (!val || val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one milestone is required when milestones are enabled"
        });
      }
    }
    return z.NEVER;
  }).optional().default([])
});

// Validation schema for Step 4: Additional Information
export const additionalInfoSchema = z.object({
  resources: z.string().optional(),
  consentAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
});
