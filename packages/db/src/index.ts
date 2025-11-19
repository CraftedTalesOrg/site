import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/hytale_mods'
const client = postgres(connectionString)
export const db = drizzle(client)
