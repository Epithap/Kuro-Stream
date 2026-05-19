import CryptoJS from 'crypto-js';

const ciphertext = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=';
const key = 'LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8';

try {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  console.log('Decrypted Hex:', bytes.toString());
  console.log('Decrypted ASCII:', Buffer.from(bytes.toString(), 'hex').toString('utf8'));
} catch (e) {
  console.error('Failed:', e.stack);
}
