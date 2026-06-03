import { z } from 'zod'

/**
 * Validates all required environment variables at startup.
 * The app will crash immediately with a clear error message
 * if any required variable is missing or invalid.
 */
const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform(Number)
    .pipe(z.number().int().positive()),

  MONGODB_URI: z
    .string()
    .optional()
    .describe('MongoDB connection string — app runs with mock data if omitted'),

  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters for security'),

  JWT_REFRESH_SECRET: z
    .string()
    .min(8, 'JWT_REFRESH_SECRET must be at least 8 characters')
    .optional(),

  JWT_EXPIRY: z.string().default('30m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  GEMINI_API_KEY: z
    .string()
    .optional()
    .describe('Google Gemini API key — app uses fallback analysis if omitted'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  CLIENT_URL: z
    .string()
    .url()
    .default('http://localhost:5173'),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join('.')}: ${issue.message}`)
    }
    process.exit(1)
  }

  return result.data
}
