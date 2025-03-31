import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthVolunteer",
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String, // URL to stored image
      required: false,
      default: "/dashboard-default-user-image.svg" // Default profile image
    },
    // Step 1: Basic Details
    basicDetails: {
      phoneNumber: {
        type: String,
        required: true,
        unique: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
      },
      location: {
        pincode: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
      },
    },

    // Step 2: Interests and Skills
    interests: {
      causes: [
        {
          type: String,
          enum: [
            "Climate Action",
            "Environmental Conservation",
            "Waste Management",
            "Wildlife Protection",
            "Marine Conservation",
            "Forest Conservation",
            "Water Conservation",
            "Air Quality",
            "Environmental Education",
            "Habitat Restoration",
            "Others"
          ],
        },
      ],
      skills: [
        {
          type: String,
          enum: [
            "Environmental Research",
            "Data Collection & Analysis",
            "Environmental Education",
            "Waste Management",
            "Community Outreach",
            "Project Management",
            "Field Work",
            "Social Media Management",
            "Photography",
            "Editorial Writing",
            "Graphic Designing",
            "Sustainable Design",
            "Water Quality Testing",
            "Others"
          ],
        },
      ],
    },

    // Step 3: Availability and Experience
    engagement: {
      availability: [
        {
          type: String,
          enum: [
            "Yearly",
            "Monthly",
            "Weekly",
            "Daily",
            "On Weekends Only",
            "One Time",
            "Remotely",
          ],
        },
      ],
      motivations: [
        {
          type: String,
          enum: [
            "Civic Responsibility",
            "Family/Societal Expectations",
            "International Norms (e.g. SDGs)",
            "Networking",
            "Personal Interest",
            "Personal or Professional Development",
            "Resume-Building",
            "School, College or Employer Requirement",
            "Other",
          ],
        },
      ],
      hasPreviousExperience: {
        type: Boolean,
        required: true,
        default: false,
      },
      previousExperience: {
        type: String,
      },
    },

    profileCompletion: {
      step1: {
        type: Boolean,
        default: false,
      },
      step2: {
        type: Boolean,
        default: false,
      },
      step3: {
        type: Boolean,
        default: false,
      },
    },
    appliedOpportunities: [
      {
        opportunity: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Opportunity",
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
        isCompleted: {
          type: Boolean,
          default: false
        },
        completionDate: {
          type: Date,
          default: null
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;
