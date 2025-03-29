// api/helpers/otpGenerator.js

import {env} from "../config/env.js";
import nodemailer from "nodemailer";

/**
 * Generates a random OTP (One-Time Password) of a specified length.
 * @param {number} length The desired length of the OTP (default is 6).
 * @returns {string} The generated OTP string.
 */
export const generateOtp = (length = 6) => {
    if (length < 4 || length > 10) {
        console.warn("OTP length should typically be between 4 and 10. Using default 6.");
        length = 6;
    }
    let otp = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};




// --- Create a reusable transporter object ---
// We create it outside the function so it's not recreated on every call.
let transporter;
let isEmailConfigured = false;

// Check if essential email configuration variables are present
if (env.emailHost && env.emailPort && env.emailUser && env.emailPass) {
    isEmailConfigured = true;
    try {
        transporter = nodemailer.createTransport({
            host: env.emailHost,
            port: env.emailPort,
            secure: env.emailSecure, // true for 465, false for other ports (like 587 using STARTTLS)
            auth: {
                user: env.emailUser, // Your email address from .env
                pass: env.emailPass, // Your email password or App Password from .env
            },
            // Optional: Add timeout values
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000, // 10 seconds
            socketTimeout: 10000, // 10 seconds
            // Optional: Add TLS options if needed (e.g., for self-signed certs - not recommended for prod)
            // tls: {
            //     rejectUnauthorized: false // Use only for local testing if necessary
            // }
        });

        // Optional: Verify transporter configuration (logs error if connection fails)
        transporter.verify((error, success) => {
            if (error) {
                console.error('Error verifying email transporter configuration:', error);
                isEmailConfigured = false; // Mark as not configured if verification fails
            } else {
                console.log('Email transporter configured and ready to send.');
            }
        });

    } catch (configError) {
        console.error('Failed to create email transporter:', configError);
        isEmailConfigured = false;
    }

} else {
    console.warn(
        'Email configuration missing in environment variables (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS). Email sending will be simulated.'
    );
}

/**
 * Sends an OTP email using nodemailer if configured, otherwise simulates.
 * @param {string} email The recipient's email address.
 * @param {string} otp The OTP code to send.
 * @returns {Promise<boolean>} A promise resolving to true if the email was sent (or simulated) successfully, false otherwise.
 */
export const sendOtpEmail = async (email, otp) => {
    // Fallback to simulation if email is not configured or transporter failed verification
    if (!isEmailConfigured || !transporter) {
        console.log('--- SIMULATING OTP EMAIL (Email not configured) ---');
        console.log(`To: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log(`Note: This OTP is valid for 10 minutes.`);
        console.log(`-------------------------------------------------`);
        // In simulation mode, assume success unless specific simulation logic dictates otherwise
        return true;
    }

    // Define email options
    const mailOptions = {
        from: env.emailFrom || `"Your App Name" <${env.emailUser}>`, // Sender address (use configured or default)
        to: email, // List of receivers
        subject: 'Your Verification Code', // Subject line
        text: `Your verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not request this code, please ignore this email.`, // Plain text body
        html: `<div style="font-family: sans-serif; line-height: 1.6;">
                 <h2>Verification Code</h2>
                 <p>Hello,</p>
                 <p>Your verification code is:</p>
                 <p style="font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 2px;">${otp}</p>
                 <p>This code is valid for <strong>10 minutes</strong>.</p>
                 <p>If you did not request this code, please ignore this email.</p>
                 <hr>
                 <p style="font-size: 0.9em; color: #555;">This is an automated message from Your App Name.</p>
               </div>`, // HTML body
    };

    // Send mail with defined transport object
    try {
        console.log(`Attempting to send OTP email to ${email}...`);
        let info = await transporter.sendMail(mailOptions);
        console.log(`OTP Email sent successfully to ${email}. Message ID: ${info.messageId}`);
        return true; // Indicate success
    } catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error);
        // Log specific SMTP errors if available
        if (error.responseCode) {
            console.error(`SMTP Error Code: ${error.responseCode}`);
            console.error(`SMTP Error Response: ${error.response}`);
        }
        return false; // Indicate failure
    }
};


