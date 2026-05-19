import CryptoJS from 'crypto-js';

const prefix = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQ';
const suffix = '4ws+Uzzw=';
const key = 'LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8';

const candidates = [
  'clXKs', 'gToke', 'euIWg', 'eshin', 'G6sP1',
  'uYZfP', 'const', 'FSGcG', 'pCQGu', 'strin',
  'gvyfG', 'eHbQf', 'qNtDx', 'g1XjR', 'repla',
  'heade', 'pired', 'UttNV', 'pRNcj', 'dbyMn',
  'hxPLO', 'xDYFJ', 'Miofo', 'accse', 'NiZwl'
];

console.log('--- Testing all base64 candidates for XMQDR decryption ---');
for (const cand of candidates) {
  const ciphertext = prefix + cand + suffix;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (decrypted) {
      console.log(`[SUCCESS] Candidate: "${cand}"`);
      console.log(`Decrypted HMAC Key:  "${decrypted}"`);
      console.log(`Full XMQDR:          "${ciphertext}"`);
    }
  } catch (e) {}
}
console.log('--- Done ---');
