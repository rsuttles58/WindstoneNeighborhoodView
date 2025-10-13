import { Request, Response } from 'express';
import { sendFeedbackEmail } from '../services/emailService';

export const submitFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { feedback, email, timestamp } = req.body;

    // Validate feedback
    if (
      !feedback ||
      typeof feedback !== 'string' ||
      feedback.trim().length === 0
    ) {
      res.status(400).json({ success: false, error: 'Feedback is required' });
      return;
    }

    // Validate email if provided
    if (email && typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid email format' });
      return;
    }

    // Send email
    await sendFeedbackEmail({
      feedback: feedback.trim(),
      email: email?.trim(),
      timestamp: timestamp || new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback. Please try again.',
    });
  }
};
