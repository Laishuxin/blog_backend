/* src/utils/cryptogram.ts */
// import CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

// TODO(rushui 2021-04-17): .env
const secretKey = 'aFF23abe9Dca11ebb1fd';

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
export function encryptPwd(password: string, salt: string): string {
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
  return encryptPwd(password, salt) === hashedPassword;
}

export const encrypt = (message: string | Object) => {
  message = typeof message === 'string' ? message : JSON.stringify(message);
  return CryptoJS.AES.encrypt(message as string, secretKey, {}).toString();
};

export const decrypt = (text: string, parse: boolean = false) => {
  const message = CryptoJS.AES.decrypt(text, secretKey, {}).toString(CryptoJS.enc.Utf8);
  return parse ? JSON.parse(message) : message;
};
