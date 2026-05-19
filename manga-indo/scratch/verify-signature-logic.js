import CryptoJS from 'crypto-js';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

// Let's calculate using our formula:
// s = timestamp + method + pathname + accessKey
// key = U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=
// HmacSHA256(key, s) => HmacSHA256(message = key, key = s)
const message = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQUttNV4ws+Uzzw=';
const key = timestamp + method + pathname + accessKey;

const signature = CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);

console.log('--- SIGNATURE VERIFICATION ---');
console.log('Calculated Signature:', signature);
console.log('Expected Signature:  ', expectedSignature);
console.log('Matches?             ', signature === expectedSignature);
