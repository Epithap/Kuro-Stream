import CryptoJS from 'crypto-js';

const ciphertext = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=';
const key = 'LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8';

try {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  console.log('--- AES DECRYPTION SUCCESS ---');
  console.log('Decrypted Secret HMAC Key:', decrypted);
} catch (e) {
  console.error('Decryption failed:', e.stack);
}
