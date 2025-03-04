import { beforeEach, describe, expect, test, vi } from "vitest"
import { sendVerificationEmail } from "./email.js"
import * as mailer from "./mailer.js"

describe("Emailing", () => {
	test('test failing send email', async () => {
		vi.spyOn(mailer, 'sendEmail').mockImplementation(async () => {
			throw new Error('test')
		})
		const res = await sendVerificationEmail('julien.athomas+test@laplateforme.io')
		expect(res).toBe(false)
	})
	test('Send verification email', async () => {
		vi.spyOn(mailer, 'sendEmail').mockImplementation(async (to, subject, html) => {
			console.log('Mocked email:', { to, subject, html })
			expect(to).toBe('julien.athomas+test@laplateforme.io')
			expect(subject).toBe('Verify your email address')
			expect(html).toContain('Email Verification')
			return true
		})
		const res = await sendVerificationEmail('julien.athomas+test@laplateforme.io')
		expect(res).toBe(true)
	})
})

