import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String, // URL for the story image, optional
        required: false
    },
    // Polymorphic reference to allow story from either Volunteer or OpportunityProvider
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'creatorModel'
    },
    creatorModel: {
        type: String,
        required: true,
        enum: ['Volunteer', 'OpportunityProvider']
    },
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Story = mongoose.model('Story', storySchema);

export default Story;