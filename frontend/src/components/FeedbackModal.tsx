import React, { useState } from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback,
            name: name || undefined,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setFeedback('');
          setName('');
          setSubmitted(false);
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {submitted ? (
          <div className="feedback-success">
            <h2>✓ Thank You!</h2>
            <p>
              Your feedback has been sent to the Windstone admin.
            </p>
          </div>
        ) : (
          <>
            <h2>Send Feedback</h2>
            <p className="feedback-subtitle">
              Share suggestions, report issues, or send a message to the admin.
              Feedback is stored privately for review.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="feedback">Your Feedback *</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or report an issue..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Your Name or Email (optional)</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or email"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
