import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

/**
 * Sends a verification email using Gmail OAuth2.
 * 
 * @param userEmail The recipient's email address.
 * @param code The verification code to send.
 */
export async function sendVerificationEmail(userEmail: string, code: string): Promise<void> {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const user = process.env.GMAIL_USER_EMAIL;

    if (!clientId || !clientSecret || !refreshToken || !user) {
        throw new Error('Missing Gmail OAuth2 credentials in environment variables.');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: user,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken, // Optional, will be refreshed if expired
            },
        } as nodemailer.TransportOptions);

        const mailOptions: MailOptions = {
            to: userEmail,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
            html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
