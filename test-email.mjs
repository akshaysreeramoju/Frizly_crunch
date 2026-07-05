import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Simple test for SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  console.log('Testing email credentials...');
  console.log('User:', process.env.SMTP_USER);
  
  try {
    const info = await transporter.sendMail({
      from: `"Frizly Crunch Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // sending to admin email for test
      subject: '✅ Frizly Crunch Email Test',
      html: '<h1>Email Configuration is Working!</h1><p>This is a test email from your local application.</p>',
    });
    console.log('Test email sent successfully!', info.messageId);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail();
