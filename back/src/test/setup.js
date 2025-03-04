import { resolve } from 'path'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({
	path: resolve(process.cwd(), '.env.test'),
	override: true
})
