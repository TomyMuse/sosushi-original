import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes, createHash } from 'crypto'

// Force reload - v2

// Rate limiting store (in-memory, resets on server restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const blockedIPs = new Map<string, number>()

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes

export function isIPBlocked(ip: string): boolean {
  const blockedUntil = blockedIPs.get(ip)
  if (blockedUntil && Date.now() < blockedUntil) {
    return true
  }
  if (blockedUntil) {
    blockedIPs.delete(ip)
  }
  return false
}

export function getRemainingBlockTime(ip: string): number {
  const blockedUntil = blockedIPs.get(ip)
  if (!blockedUntil) return 0
  return Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000 / 60))
}

export function recordLoginAttempt(ip: string, success: boolean): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now()
  
  if (success) {
    loginAttempts.delete(ip)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }
  
  const attempts = loginAttempts.get(ip)
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }
  
  // Reset if outside window
  if (now - attempts.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }
  
  const newCount = attempts.count + 1
  
  if (newCount >= MAX_ATTEMPTS) {
    blockedIPs.set(ip, now + BLOCK_DURATION)
    loginAttempts.delete(ip)
    return { allowed: false, remainingAttempts: 0 }
  }
  
  loginAttempts.set(ip, { count: newCount, lastAttempt: now })
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - newCount }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateSessionToken(): string {
  const randomString = randomBytes(32).toString('hex')
  const timestamp = Date.now().toString()
  return createHash('sha256').update(`${randomString}:${timestamp}`).digest('hex')
}

export function generateSessionExpiry(): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 8) // 8 hour session
  return expiry
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    }
  })
}

export async function validateSession(token: string): Promise<{ valid: boolean; userId?: string }> {
  if (!token) return { valid: false }
  
  const session = await db.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, role: true } } }
  })
  
  if (!session) return { valid: false }
  
  if (new Date() > session.expiresAt) {
    await db.session.delete({ where: { token } })
    return { valid: false }
  }
  
  return { valid: true, userId: session.userId }
}

export async function deleteSession(token: string) {
  try {
    await db.session.delete({ where: { token } })
  } catch {
    // Session might not exist
  }
}

export async function cleanupExpiredSessions() {
  await db.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
}
