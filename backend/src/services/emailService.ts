import nodemailer from 'nodemailer';

// Choose email service based on environment
const isProduction = process.env.NODE_ENV === 'production';
const useGmail = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

let transporter: nodemailer.Transporter;

// Initialize transporter
const initTransporter = async () => {
  if (useGmail) {
    // Use Gmail with App Password
    console.log('Using Gmail for email service');
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ''), // Remove spaces
      },
    });
  } else {
    // Use Ethereal for testing (creates temporary test account)
    console.log('Gmail not configured, using Ethereal test email service');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Ethereal Test Account Created:');
    console.log('  User:', testAccount.user);
    console.log('  Pass:', testAccount.pass);
    console.log('  View emails at: https://ethereal.email/messages');
  }
};

// Initialize on module load
let initPromise = initTransporter();

export interface FeedbackEmail {
  feedback: string;
  email?: string;
  timestamp: string;
}

export const sendFeedbackEmail = async (data: FeedbackEmail): Promise<void> => {
  // Wait for transporter initialization
  await initPromise;

  const recipientEmail =
    process.env.ADMIN_EMAIL || 'robert.suttles58@gmail.com';

  const mailOptions = {
    from: process.env.EMAIL_USER || 'feedback@windstone.test',
    to: recipientEmail,
    subject: 'Windstone Decorations - New Feedback',
    html: `
      <h2>New Feedback from Windstone Neighborhood Decorations</h2>
      <p><strong>Submitted:</strong> ${new Date(
        data.timestamp
      ).toLocaleString()}</p>
      ${
        data.email
          ? `<p><strong>From:</strong> ${data.email}</p>`
          : '<p><strong>From:</strong> Anonymous</p>'
      }
      <hr>
      <h3>Feedback:</h3>
      <p>${data.feedback.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback email sent successfully');
    console.log('Message ID:', info.messageId);

    // If using Ethereal, provide preview URL
    if (!useGmail) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
      console.log(
        '⚠️  Using test email service. To send real emails, configure Gmail credentials in .env'
      );
    }
  } catch (error) {
    console.error('Error sending feedback email:', error);
    throw new Error('Failed to send feedback email');
  }
};
