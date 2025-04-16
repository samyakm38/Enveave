// src/__tests__/story.controller.test.js

import request from 'supertest';
import mongoose from 'mongoose';
// import { jest } from '@jest/globals'; // Required for mocking in ESM

// Import the Express App instance
import app from '../../index.js'; // Adjust path if needed

// Import the model to interact with the database directly for setup/assertions
import Story from '../../models/story.model.js';
import {beforeEach, describe, expect, it} from "@jest/globals";

// Use the validMongoId generated in setupTests.js (or generate one here if needed)
// Assuming setupTests.js makes it available or we know the mock value
const validMongoId = new mongoose.Types.ObjectId().toString(); // Or get from setup mock

// Mock the JWT verify function more specifically if needed within tests,
// although the global mock should cover most cases.
// We rely on the global mock from setupTests.js here.

describe('Story API Endpoints', () => {
    // Use the globally mocked jwt.verify function
    const mockToken = 'mock-valid-token'; // Any string works with the basic mock
    const mockInvalidToken = 'invalid-token'; // Specific string the mock checks for errors

    // Shared data for tests
    const storyData = {
        title: 'A Wonderful Volunteering Experience',
        content: 'Today, I helped build a house and it felt amazing.',
        photo: 'http://example.com/photo.jpg',
    };

    const createPublishedStory = async (overrideData = {}) => {
        const story = new Story({
            title: 'Published Story Title',
            content: 'This story is published.',
            photo: 'http://example.com/published.jpg',
            creator: new mongoose.Types.ObjectId(), // Use a new valid ID
            creatorModel: 'AuthVolunteer', // Or AuthOpportunityProvider
            published: true,
            publishedAt: new Date(),
            ...overrideData,
        });
        await story.save();
        return story;
    };

    const createUnpublishedStory = async (overrideData = {}) => {
        const story = new Story({
            title: 'Unpublished Story Title',
            content: 'This story is not published yet.',
            creator: new mongoose.Types.ObjectId(),
            creatorModel: 'AuthOpportunityProvider',
            published: false,
            ...overrideData,
        });
        await story.save();
        return story;
    };



    // ======================================
    // GET /api/get-stories (View Three)
    // ======================================
    describe('GET /api/get-stories', () => {
        it('should return the 3 most recent published stories', async () => {
            // Create stories with varying published times
            await createPublishedStory({ title: 'Story 1', publishedAt: new Date(Date.now() - 3000) });
            const story2 = await createPublishedStory({ title: 'Story 2', publishedAt: new Date(Date.now() - 1000) });
            const story3 = await createPublishedStory({ title: 'Story 3', publishedAt: new Date(Date.now() - 2000) });
            const story4 = await createPublishedStory({ title: 'Story 4 (Most Recent)', publishedAt: new Date() });
            await createUnpublishedStory({title: 'Unpublished'}); // Should be ignored

            const res = await request(app).get('/api/get-stories');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Three recent stories retrieved');
            expect(res.body.stories).toBeDefined();
            expect(res.body.stories.length).toBe(3);
            // Check if the most recent stories are returned (based on publishedAt)
            expect(res.body.stories[0].title).toBe('Story 4 (Most Recent)');
            expect(res.body.stories[1].title).toBe('Story 2');
            expect(res.body.stories[2].title).toBe('Story 3');
            // Check if creator population worked (might be null if creator id doesn't exist in users collection)
            // In a real scenario, you might want to create mock users too.
            // For now, we just check the field exists.
            expect(res.body.stories[0]).toHaveProperty('creator');
        });

        it('should return fewer than 3 stories if less exist', async () => {
            await createPublishedStory({ title: 'Only Story 1' });
            await createPublishedStory({ title: 'Only Story 2' });

            const res = await request(app).get('/api/get-stories');

            expect(res.statusCode).toBe(200);
            expect(res.body.stories.length).toBe(2);
        });

        it('should return 404 if no published stories exist', async () => {
            await createUnpublishedStory(); // Only unpublished

            const res = await request(app).get('/api/get-stories');

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('No published stories found.');
        });
    });

    // ======================================
    // GET /api/get-all-stories
    // ======================================
    describe('GET /api/get-all-stories', () => {
        beforeEach(async () => {
            // Create 15 published stories for pagination tests
            const promises = [];
            for (let i = 1; i <= 15; i++) {
                promises.push(createPublishedStory({
                    title: `Story ${i}`,
                    publishedAt: new Date(Date.now() - i * 1000) // Ensure order
                }));
            }
            await Promise.all(promises);
            await createUnpublishedStory(); // Add one unpublished to ensure it's filtered
        });

        it('should return the first page of stories with default limit (10)', async () => {
            const res = await request(app).get('/api/get-all-stories');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Stories retrieved successfully');
            expect(res.body.stories).toBeDefined();
            expect(res.body.stories.length).toBe(10);
            expect(res.body.stories[0].title).toBe('Story 1'); // Most recent based on setup
            expect(res.body.pagination).toBeDefined();
            expect(res.body.pagination.totalStories).toBe(15);
            expect(res.body.pagination.totalPages).toBe(2);
            expect(res.body.pagination.currentPage).toBe(1);
            expect(res.body.pagination.hasNextPage).toBe(true);
            expect(res.body.pagination.hasPrevPage).toBe(false);
        });

        it('should return the second page of stories with a specific limit', async () => {
            const res = await request(app).get('/api/get-all-stories?page=2&limit=5');

            expect(res.statusCode).toBe(200);
            expect(res.body.stories.length).toBe(5);
            expect(res.body.stories[0].title).toBe('Story 6'); // (Page 2, Limit 5 starts at 6th story)
            expect(res.body.pagination.totalStories).toBe(15);
            expect(res.body.pagination.totalPages).toBe(3); // 15 stories / 5 per page = 3 pages
            expect(res.body.pagination.currentPage).toBe(2);
            expect(res.body.pagination.hasNextPage).toBe(true);
            expect(res.body.pagination.hasPrevPage).toBe(true);
        });

        it('should return the last page correctly', async () => {
            const res = await request(app).get('/api/get-all-stories?page=2&limit=10'); // 10 per page, page 2

            expect(res.statusCode).toBe(200);
            expect(res.body.stories.length).toBe(5); // Only 5 stories left
            expect(res.body.stories[0].title).toBe('Story 11');
            expect(res.body.pagination.currentPage).toBe(2);
            expect(res.body.pagination.hasNextPage).toBe(false);
            expect(res.body.pagination.hasPrevPage).toBe(true);
        });

        it('should return 404 if page number is out of bounds', async () => {
            const res = await request(app).get('/api/get-all-stories?page=5&limit=10'); // Page 5 doesn't exist

            expect(res.statusCode).toBe(404); // Should return 404 as no stories are found for this page
            expect(res.body.message).toBe('No published stories found.');
        });

        it('should return 404 if no published stories exist at all', async () => {
            // Clear the DB first for this specific case
            await Story.deleteMany({});
            const res = await request(app).get('/api/get-all-stories');

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('No published stories found.');
        });
    });

    // ======================================
    // GET /api/get-story/:id
    // ======================================
    describe('GET /api/get-story/:id', () => {
        let publishedStory;
        let unpublishedStory;

        beforeEach(async () => {
            publishedStory = await createPublishedStory({ title: 'Specific Published Story'});
            unpublishedStory = await createUnpublishedStory();
        });

        it('should return a specific published story by ID', async () => {
            const res = await request(app).get(`/api/get-story/${publishedStory._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Story retrieved successfully');
            expect(res.body.story).toBeDefined();
            expect(res.body.story._id).toBe(publishedStory._id.toString());
            expect(res.body.story.title).toBe(publishedStory.title);
            expect(res.body.story.published).toBe(true);
            expect(res.body.story).toHaveProperty('creator'); // Check population
        });

        it('should return 404 if story ID does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/api/get-story/${nonExistentId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Story not found or not published.');
        });

        it('should return 404 if the story is unpublished', async () => {
            const res = await request(app).get(`/api/get-story/${unpublishedStory._id}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Story not found or not published.');
        });

        it('should return 400 if the story ID format is invalid', async () => {
            const invalidId = 'invalid-id-format';
            const res = await request(app).get(`/api/get-story/${invalidId}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid story ID format.');
        });
    });
});