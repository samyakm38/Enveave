import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import Header from "../../main components/Header.jsx";
import Footer from "../../main components/Footer.jsx";
import useAdmin from '../../../redux/hooks/useAdmin';
import '../../../stylesheet/CreateStoryForm.css';

const CreateStoryForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('/home-story-3.png'); // Default image
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const { createStory } = useAdmin();
    
    // Handle image preview when file is selected
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            return;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }
        
        setImageFile(file);
        setError(null);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };
    
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link'],
            ['clean']
        ],
    };
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link'
    ];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Create form data to handle file upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (imageFile) {
                formData.append('photo', imageFile);
            }
            
            const result = await createStory(formData);
            
            if (result.success) {
                navigate('/admin/dashboard/stories');
            } else {
                setError(result.message || 'Failed to create story');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while creating the story');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="create-story-form-page">
            <Header />
            <div className="create-story-form-container">
                <div className="create-story-form-back-button-container">
                    <button 
                        className="create-story-form-back-button"
                        onClick={() => navigate('/admin/dashboard/stories')}
                    >
                        <FaArrowLeft /> <span>Back to Stories</span>
                    </button>
                </div>
                
                <h1 className="create-story-form-title">Create New Story</h1>
                
                {error && (
                    <div className="create-story-form-error-message">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="create-story-form">
                    <div className="create-story-form-group">
                        <label htmlFor="title">Story Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter a compelling title"
                            className="create-story-form-input"
                        />
                    </div>
                    
                    <div className="create-story-form-group">
                        <label htmlFor="content">Story Content *</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your story here..."
                            className="create-story-form-editor"
                        />
                    </div>
                    
                    <div className="create-story-form-group">
                        <label>Story Image</label>
                        <div className="create-story-form-image-container">
                            <div className="create-story-form-image-preview">
                                <img src={imagePreview} alt="Story preview" />
                            </div>
                            <div className="create-story-form-image-upload">
                                <label htmlFor="image" className="create-story-form-image-upload-label">
                                    <FaUpload /> Choose Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="create-story-form-image-input"
                                />
                                <p className="create-story-form-image-help-text">
                                    Max size: 5MB. Recommended dimensions: 1200×800px
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="create-story-form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/dashboard/stories')}
                            className="create-story-form-cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="create-story-form-submit-btn"
                            disabled={isSubmitting || !title || !content}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Story'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreateStoryForm;
