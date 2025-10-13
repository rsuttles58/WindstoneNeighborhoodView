import { Request, Response } from 'express';
import { query } from '../config/database';

interface Feedback {
  id: number;
  feedback: string;
  name: string | null;
  created_at: string;
}

export const submitFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { feedback, name } = req.body;

    // Validate feedback
    if (
      !feedback ||
      typeof feedback !== 'string' ||
      feedback.trim().length === 0
    ) {
      res.status(400).json({ success: false, error: 'Feedback is required' });
      return;
    }

    // Validate name if provided
    if (name && typeof name !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid name format' });
      return;
    }

    // Save to database
    const result = await query<Feedback>(
      'INSERT INTO feedback (feedback, name) VALUES ($1, $2) RETURNING *',
      [feedback.trim(), name?.trim() || null]
    );

    console.log('✅ Feedback saved to database:', {
      id: result.rows[0].id,
      from: name || 'Anonymous',
    });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback. Please try again.',
    });
  }
};

// Get all feedback (for admin viewing)
export const getFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await query<Feedback>(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
};

// Delete feedback by ID
export const deleteFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Feedback>(
      'DELETE FROM feedback WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Feedback not found' });
      return;
    }

    console.log('🗑️  Feedback deleted:', { id });

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to delete feedback' });
  }
};
