import express from 'express';
import {addStory, viewThreeStories} from "../controllers/story.controller.js";
const router = express.Router();

router.post('/add-story',addStory);
router.get('/get-stories', viewThreeStories);


export default router;