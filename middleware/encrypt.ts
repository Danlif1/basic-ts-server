import {createHmac} from 'crypto';
import * as dotenv from 'dotenv';
import {join} from 'path';

dotenv.config({path: join(__dirname, '..', '.env')});

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
