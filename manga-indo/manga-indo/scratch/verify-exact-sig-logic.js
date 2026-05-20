import crypto from 'crypto';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

// key = n.XMQDR (the ciphertext!)
// decryptedHMACKey = "xxxoidj"
// message = timestamp + method + pathname + accessKey + decryptedHMACKey
const key = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQG6sP14ws+Uzzw=';
const decryptedHMACKey = 'xxxoidj';
const message = timestamp + method + pathname + accessKey + decryptedHMACKey;

// Standard HmacSHA256 order:
// In CryptoJS: HmacSHA256(message, key) => in node crypto is:
// crypto.createHmac('sha256', key).update(message).digest('hex')
const sig1 = crypto.createHmac('sha256', key).update(message).digest('hex');
const sig2 = crypto.createHmac('sha256', message).update(key).digest('hex');

console.log('--- TESTING EXACT INTERCEPTED SIGNATURE ---');
console.log('Key:                 ', key);
console.log('Message:             ', message);
console.log('sig1 (standard):     ', sig1);
console.log('sig2 (swapped):      ', sig2);
console.log('Expected Signature:  ', expectedSignature);
console.log('sig1 Matches?        ', sig1 === expectedSignature);
console.log('sig2 Matches?        ', sig2 === expectedSignature);
