import crypto from 'crypto';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

// Swapped order: key is n.XMQDR, message is s
const message = timestamp + method + pathname + accessKey;
const key = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=';

const signature = crypto.createHmac('sha256', key).update(message).digest('hex');

console.log('--- SIGNATURE VERIFICATION (SWAPPED) ---');
console.log('Calculated Signature:', signature);
console.log('Expected Signature:  ', expectedSignature);
console.log('Matches?             ', signature === expectedSignature);
