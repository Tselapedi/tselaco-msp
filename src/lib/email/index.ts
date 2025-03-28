import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tselacomsp.com',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to TselacoMSP!</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 24 hours.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendDriverApprovalEmail(email: string, referenceNumber: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tselacomsp.com',
      to: email,
      subject: 'Driver Application Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations!</h2>
          <p>Your driver application has been approved.</p>
          <p>Your driver reference number is: <strong>${referenceNumber}</strong></p>
          <p>Please keep this number safe as it will be used for all future communications.</p>
          <p>You can now log in to your driver account and start accepting rides.</p>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error sending driver approval email:', error)
    throw new Error('Failed to send driver approval email')
  }
}

export async function sendDriverRejectionEmail(email: string, reason: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tselacomsp.com',
      to: email,
      subject: 'Driver Application Status Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Application Status Update</h2>
          <p>We regret to inform you that your driver application has been rejected.</p>
          <p>Reason: ${reason}</p>
          <p>If you believe this is a mistake or would like to appeal this decision, please contact our support team.</p>
        </div>
      `
    })
    return true
  } catch (error) {
    console.error('Error sending driver rejection email:', error)
    throw new Error('Failed to send driver rejection email')
  }
}
