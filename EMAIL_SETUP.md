# Email Setup for Feedback Feature

The feedback feature sends emails to **robert.suttles58@gmail.com** when neighbors submit feedback.

## Gmail Setup (Recommended for Personal Use)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left menu
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the prompts to enable it

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. In the "Select app" dropdown, choose **Mail**
3. In the "Select device" dropdown, choose **Other (Custom name)**
4. Enter: **Windstone Decorations App**
5. Click **Generate**
6. **Copy the 16-character password** (you won't see it again!)

### Step 3: Add to Backend .env

Edit `backend/.env` and add these lines:

```bash
# Email Configuration
EMAIL_USER=robert.suttles58@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
```

Replace `your_16_character_app_password_here` with the password you generated.

### Step 4: Restart Backend

```bash
cd backend
npm run dev
```

## Test the Feature

1. Open the app in your browser
2. Click the **💬 Send Feedback** button in the footer
3. Submit test feedback
4. Check robert.suttles58@gmail.com for the email

## Security Notes

✅ **App Passwords are safer than your actual password**

- They can only be used for the specific app
- Can be revoked anytime without changing your main password
- Separate from your Google account password

✅ **Never commit .env files to git**

- `.env` is already in `.gitignore`
- App password should remain private

## Alternative: SendGrid (For Production/High Volume)

If you expect high volume or want better deliverability:

1. Sign up for SendGrid: https://sendgrid.com/
2. Get API key
3. Update `backend/src/services/emailService.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

4. Add to `.env`:

```bash
SENDGRID_API_KEY=your_sendgrid_api_key
```

SendGrid offers 100 emails/day free tier.

## Troubleshooting

### "Invalid login" error

- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check for typos in EMAIL_USER or EMAIL_PASSWORD

### Emails not arriving

- Check spam folder
- Verify EMAIL_USER is correct
- Make sure backend is running and logs show no errors
- Test email credentials with: https://ethereal.email/

### Rate limiting

- Gmail limits: ~500 emails/day for regular accounts
- For higher volume, use SendGrid or AWS SES

## Current Configuration

- **Recipient**: robert.suttles58@gmail.com
- **Rate Limit**: 10 feedback submissions per hour per IP
- **Email Service**: Gmail (via nodemailer)
- **Subject Line**: "Windstone Decorations - New Feedback"
