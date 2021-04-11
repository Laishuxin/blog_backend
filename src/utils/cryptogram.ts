/* src/utils/cryptogram.ts */

import * as crypto from 'crypto';

/**
 * Make salt
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * Encrypt password
 * @param password 密码
 * @param salt 密码盐
 */
export function encrypt(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 1000, 16, 'sha256').toString('base64')
  );
}

/**
 * Validate password
 * @param password raw
 * @param salt
 * @param hashedPassword encrypted password
 * @returns true if pass, else false.
 */
export function validate(
  password: string,
  salt: string,
  hashedPassword: string,
): boolean {
  return encrypt(password, salt) === hashedPassword;
}