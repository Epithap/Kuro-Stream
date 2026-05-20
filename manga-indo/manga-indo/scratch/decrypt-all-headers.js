import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

function getVal(e, key) {
  const match = data.find(d => d.e === e && d.key === key);
  return match ? match.val : `[NOT FOUND: e=${e}, key=${key}]`;
}

console.log('--- Decrypting Header Keys and Variables ---');

const headerTimeKey = getVal(117 + 174, 'eXA!') + getVal(-94 + 174, '4iVX') + getVal(248 + 174, 'ipzp') + 'me';
console.log('n.TaxZs (headerTimeKey):', headerTimeKey);

const accessKeyHeader = getVal(159 + 174, 'rFVS');
console.log('n[t(159)] (accessKeyHeader):', accessKeyHeader);

const configAccessKeyPath = getVal(723 + 174, 'G48x') + getVal(301 + 174, '9lff');
const configAccessKeyProp = getVal(74 + 174, 'flu#') + getVal(671 + 174, '&Vgz');
console.log('this.configuration.accessKeyPath:', configAccessKeyPath);
console.log('this.configuration.accessKeyProp:', configAccessKeyProp);

const signatureHeader = getVal(223 + 174, '6$g&');
console.log('n[t(223)] (signatureHeader):', signatureHeader);

const methodCall = getVal(-36 + 174, 'ipzp');
console.log('n[t(-36)] (methodCall):', methodCall);

// Let's decrypt t(257, '&Vgz') which is used to sign: c = await this[t(257, '&Vgz')](i, s)
const signMethod = getVal(257 + 174, '&Vgz');
console.log('this[t(257)] (signMethod):', signMethod);
