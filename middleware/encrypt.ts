import {createHmac} from 'crypto';

/**
 * Hashing the password.
 * @param password The password to encrypt.
 */
export function hashPassword(password: string): string {
  const secret = process.env.SECRET_ENC_KEY || 'default-secret';
  const hash = createHmac('sha256', secret)
    .update(password)
    .digest('hex');
  return hash;
}
