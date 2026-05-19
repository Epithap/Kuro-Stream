import crypto from 'crypto';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

// key = timestamp + method + pathname + accessKey + decryptedHMACKey
// message = 'x-wm-request'
const decryptedHMACKey = 'xxxoidj';
const key = timestamp + method + pathname + accessKey + decryptedHMACKey;
const message = 'x-wm-request';

const signature = crypto.createHmac('sha256', key).update(message).digest('hex');

console.log('--- TESTING TRUE CRYPTOJS SIGNATURE ---');
console.log('Key:                 ', key);
console.log('Message:             ', message);
console.log('Calculated Signature:', signature);
console.log('Expected Signature:  ', expectedSignature);
console.log('Matches?             ', signature === expectedSignature);
