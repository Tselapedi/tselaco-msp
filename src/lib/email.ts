import nodemailer from 'nodemailer'
import { config } from '@/config'

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
})

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Verify Your Email - TselacoMSP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to TselacoMSP!</h2>
        <p>Thank you for registering. To complete your registration, please use the following verification code:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code will expire in 24 hours.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendDriverApprovalEmail(to: string, referenceNumber: string): Promise<void> {
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Driver Application Approved - TselacoMSP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Congratulations!</h2>
        <p>Your driver application has been approved. You can now start accepting rides.</p>
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p style="margin: 0;">Your driver reference number is:</p>
          <h2 style="color: #1f2937; margin: 10px 0;">${referenceNumber}</h2>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Please keep this number for your records. It will be used for all future correspondence.
          </p>
        </div>
        <p>You can now log in to your driver account and start accepting rides.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send driver approval email:', error)
    throw new Error('Failed to send driver approval email')
  }
}

export async function sendDriverRejectionEmail(to: string, reason: string): Promise<void> {
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Driver Application Status Update - TselacoMSP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>We have reviewed your driver application and unfortunately, we cannot approve it at this time.</p>
        <div style="background-color: #fef2f2; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #991b1b;">Reason for rejection:</p>
          <p style="margin: 10px 0;">${reason}</p>
        </div>
        <p>You may address these issues and submit a new application after 30 days.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send driver rejection email:', error)
    throw new Error('Failed to send driver rejection email')
  }
}
