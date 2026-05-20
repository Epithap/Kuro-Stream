import crypto from 'crypto';

const timestamp = '1779194755';
const method = 'GET';
const pathname = '/api/contents/home-data';
const accessKey = 'WM_WEB_FRONT_END';

const expectedSignature = '19eb0a9008e56cebf026c2fd34cda76562d5f6f092a42786b96bebade1c67e3e';

const candidates = [
  { cand: 'G6sP1', key: 'xxxoidj' },
  { cand: 'hxPLO', key: '`' },
  { cand: 'accse', key: ' +' }
];

// Let's also check if there is a different key or order!
// Let's define multiple message structures:
const messages = [
  timestamp + method + pathname + accessKey,
  timestamp + method.toUpperCase() + pathname + accessKey,
  timestamp + method.toLowerCase() + pathname + accessKey,
  timestamp + pathname + method + accessKey,
  accessKey + pathname + method + timestamp,
  timestamp + pathname + accessKey
];

console.log('--- Testing combinations ---');
for (const item of candidates) {
  for (const msg of messages) {
    // Try both orders
    const sig1 = crypto.createHmac('sha256', item.key).update(msg).digest('hex');
    const sig2 = crypto.createHmac('sha256', msg).update(item.key).digest('hex');
    
    if (sig1 === expectedSignature) {
      console.log(`[MATCH FOUND!!!] Order: HmacSHA256(message, key)`);
      console.log(`Key: "${item.key}"`);
      console.log(`Message: "${msg}"`);
      process.exit(0);
    }
    if (sig2 === expectedSignature) {
      console.log(`[MATCH FOUND!!!] Order: HmacSHA256(key, message)`);
      console.log(`Key: "${item.key}"`);
      console.log(`Message: "${msg}"`);
      process.exit(0);
    }
  }
}
console.log('No matches found.');
