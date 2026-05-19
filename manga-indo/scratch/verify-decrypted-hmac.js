import crypto from 'crypto';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

// Swapped or regular?
// CryptoJS.HmacSHA256(message, key) => in standard node crypto is:
// crypto.createHmac('sha256', key).update(message).digest('hex')
// Wait!
// In CryptoJS.HmacSHA256(message, key), the MESSAGE is the first argument, and the KEY is the second!
// So:
// message = timestamp + method + pathname + accessKey
// key = decryptedHMACKey (which is 'xxxoidj')
const message = timestamp + method + pathname + accessKey;
const key = 'xxxoidj';

const signature = crypto.createHmac('sha256', key).update(message).digest('hex');

console.log('--- HMAC WITH DECRYPTED KEY ---');
console.log('Key:                 ', key);
console.log('Message:             ', message);
console.log('Calculated Signature:', signature);
console.log('Expected Signature:  ', expectedSignature);
console.log('Matches?             ', signature === expectedSignature);
