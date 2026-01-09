import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10)
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

export interface AdminSessionData {
  restaurantId: string
  adminUserId: string
}

export async function createAdminSession(restaurantId: string, adminUserId: string) {
  const cookieStore = await cookies()
  const sessionData: AdminSessionData = { restaurantId, adminUserId }
  cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  })
}

export async function getAdminSession(): Promise<AdminSessionData | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  if (!session?.value) {
    return null
  }
  try {
    return JSON.parse(session.value) as AdminSessionData
  } catch {
    return null
  }
}

export async function requireAdminSession(): Promise<AdminSessionData> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized: No admin session')
  }
  
  // Verify restaurant still exists (not deleted)
  const { prisma } = await import('@/lib/prisma')
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.restaurantId },
    select: { id: true },
  })
  
  if (!restaurant) {
    // Restaurant was deleted - clear session and throw error
    await deleteAdminSession()
    throw new Error('Restaurant not found: This restaurant has been deleted')
  }
  
  return session
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

// Super Admin Session functions
const SUPER_ADMIN_SESSION_COOKIE = 'super_admin_session'
const SUPER_ADMIN_PIN = '1244'

export async function createSuperAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SUPER_ADMIN_SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  })
}

export async function getSuperAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SUPER_ADMIN_SESSION_COOKIE)
  return session?.value === 'authenticated'
}

export async function deleteSuperAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SUPER_ADMIN_SESSION_COOKIE)
}

export function getSuperAdminPin(): string {
  // Use environment variable if set, otherwise fallback to hardcoded PIN
  return process.env.SUPER_ADMIN_PASSWORD || SUPER_ADMIN_PIN
}

// Simple rate limiting (in-memory)
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const RESET_TIME = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RESET_TIME })
    return { allowed: true }
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return { allowed: false, resetIn: attempt.resetAt - now }
  }

  attempt.count++
  return { allowed: true }
}




