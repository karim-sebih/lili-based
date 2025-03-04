import env from '../config/env.js'
import { sign } from 'hono/jwt'
import { sendEmail } from './mailer.js'

/**
 * Sends a verification email to the user
 * @param userEmail The email address of the user
 * @returns Promise<boolean> True if email was sent successfully
 */
export async function sendVerificationEmail(userEmail) {
  const verificationToken = await sign(
    {
      email: userEmail,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    },
    env.JWT_SECRET,
  )
  const verificationUrl = `http://127.0.0.1:3000/api/verify/${verificationToken}`
  const html = `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      `
  try {
    await sendEmail(userEmail, 'Verify your email address', html)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

export async function sendPasswordResetEmail(email, resetToken) {
  const verificationUrl = `${env.APP_URL}/reset-password?token=${resetToken}`
  const html = `
        <h1>Reset password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${verificationUrl}">Reset password</a>
        <p>This link will expire in 24 hours.</p>
      `
  try {
    await sendEmail(email, 'Verify your email address', html)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

