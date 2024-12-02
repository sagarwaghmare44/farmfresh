import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'farmfresh2201@gmail.com',
        pass: process.env.EMAIL_PASSWORD // Add this to your .env file
    }
});

export const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const mailOptions = {
            from: email,
            to: 'farmfresh2201@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
}; 