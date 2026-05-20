import CryptoJS from 'crypto-js';

const targetSig = 'fd2a9ffd6a5117571bc9abd5ad556f6660db22a185ccc0a65476addead4eab5a';

const time = '1779197548';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';
const salt = 'xxxoidj';

const message = time + method + pathname + accessKey + salt;
const key = 'wm-api-request';

console.log('Target Signature: ', targetSig);
console.log('Message:          ', message);
console.log('Key:              ', key);

// Case 1: HmacSHA256(key, message) => HmacSHA256("wm-api-request", message)
const sig1 = CryptoJS.HmacSHA256(key, message).toString(CryptoJS.enc.Hex);
console.log('Case 1 Result:    ', sig1);
console.log('Case 1 Match?     ', sig1 === targetSig);

// Request 2
const targetSig2 = '63b8938d17c1faac55d1f0770416c953a6c50352d660a6dbd96b451281e90a57';
const pathname2 = '/api/contents/new-projects';
const message2 = time + method + pathname2 + accessKey + salt;

const sig2_calc = CryptoJS.HmacSHA256(key, message2).toString(CryptoJS.enc.Hex);
console.log('\nRequest 2 Target: ', targetSig2);
console.log('Request 2 Calc:   ', sig2_calc);
console.log('Request 2 Match?  ', sig2_calc === targetSig2);
