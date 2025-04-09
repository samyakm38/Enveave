import express from 'express';
import {addStory, viewThreeStories, getAllStories, getStoryById} from "../controllers/story.controller.js";
const router = express.Router();

router.post('/add-story',addStory);
router.get('/get-stories', viewThreeStories);
router.get('/get-all-stories', getAllStories);
router.get('/get-story/:id', getStoryById);

export default router;