import express from 'express';
import { submitFeedback, getFeedback, deleteFeedback } from '../controllers/feedbackController';

const router = express.Router();

// Submit feedback
router.post('/', submitFeedback);

// Get all feedback (admin)
router.get('/', getFeedback);

// Delete feedback by ID
router.delete('/:id', deleteFeedback);

export default router;
