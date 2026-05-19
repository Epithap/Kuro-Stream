import fs from 'fs';
import vm from 'vm';

const runner = fs.readFileSync('scratch/decrypters-rotated.js', 'utf8');
const joCode = fs.readFileSync('scratch/jo-class.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { qo } = context.globalThis;

function H(e, t) {
  return qo(e - 771, t);
}

// Let's find all occurrences of H(...) and decrypt them
// We can use a regex to match H(number, `key`) or H(number, 'key')
const hRegex = /H\(\s*(-?\d+)\s*,\s*[`'"]([^`'"]+)[`'"]\s*\)/g;

let decryptedJo = joCode;
let match;
while ((match = hRegex.exec(joCode)) !== null) {
  const fullExpr = match[0];
  const offset = parseInt(match[1]);
  const key = match[2];
  try {
    const val = H(offset, key);
    // Replace all occurrences of fullExpr with the string representation of val
    decryptedJo = decryptedJo.replaceAll(fullExpr, JSON.stringify(val));
  } catch (err) {
    // console.log(`Failed to decrypt ${fullExpr}: ${err.message}`);
  }
}

// Let's write the decrypted version to scratch/jo-class-decrypted.js
fs.writeFileSync('scratch/jo-class-decrypted.js', decryptedJo);
console.log('Saved decrypted class Jo to scratch/jo-class-decrypted.js');
