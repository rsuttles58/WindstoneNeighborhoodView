import sgMail from '@sendgrid/mail';

// Configure SendGrid if API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const useSendGrid = !!SENDGRID_API_KEY;

if (useSendGrid) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid email service configured');
} else {
  console.log('⚠️  No email service configured - feedback will be logged to console only');
  console.log('   To enable emails, add SENDGRID_API_KEY to environment variables');
}

export interface FeedbackEmail {
  feedback: string;
  email?: string;
  timestamp: string;
}

export const sendFeedbackEmail = async (data: FeedbackEmail): Promise<void> => {
  const recipientEmail = process.env.ADMIN_EMAIL || 'robert.suttles58@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || 'feedback@windstone.app';

  const emailContent = {
    to: recipientEmail,
    from: fromEmail,
    subject: 'Windstone Decorations - New Feedback',
    html: `
      <h2>New Feedback from Windstone Neighborhood Decorations</h2>
      <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
      ${data.email ? `<p><strong>From:</strong> ${data.email}</p>` : '<p><strong>From:</strong> Anonymous</p>'}
      <hr>
      <h3>Feedback:</h3>
      <p>${data.feedback.replace(/\n/g, '<br>')}</p>
    `,
  };

  if (useSendGrid) {
    // Send via SendGrid
    try {
      await sgMail.send(emailContent);
      console.log('✅ Feedback email sent successfully via SendGrid');
    } catch (error) {
      console.error('❌ Error sending feedback email:', error);
      throw new Error('Failed to send feedback email');
    }
  } else {
    // No email service - just log to console
    console.log('📧 FEEDBACK RECEIVED (Email not configured):');
    console.log('  To:', recipientEmail);
    console.log('  From:', data.email || 'Anonymous');
    console.log('  Time:', new Date(data.timestamp).toLocaleString());
    console.log('  Message:', data.feedback);
    console.log('─'.repeat(50));
    // Don't throw error - feedback is "sent" via console
  }
};
