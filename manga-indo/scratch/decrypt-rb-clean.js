import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbIdx = code.indexOf('function Rb(){');
const rbEndIdx = code.indexOf('function Lb', rbIdx);
const rbCodeRaw = code.substring(rbIdx, rbEndIdx);

// Clean any import statements
const rbCode = rbCodeRaw.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');

const lbIdx = code.indexOf('function Lb(');
const lbEndIdx = code.indexOf('var ds=class', lbIdx);
const lbCodeRaw = code.substring(lbIdx, lbEndIdx !== -1 ? lbEndIdx : lbIdx + 2000);
const lbCode = lbCodeRaw.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');

const runner = `
${rbCode}
${lbCode}
globalThis.lbDecrypted = Lb;
globalThis.rbDecrypted = Rb;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

const rbArray = context.globalThis.rbDecrypted();
console.log('Rb array size:', rbArray.length);

const keys = ['1Q1^', '1!pJ', '0cSO', 'XLgh', 'G48x', 'flu#', 'wpLQ', 'ipzp', 'DOuN', 'LT*@', 'J#Yc', 'RDIL', ']*We', 'U96T', 'Skig', 'EZNS', 'q$$g', 'JviX', 'cgpE', 'Zs2M', 'RbFd', 'DOuN', 'NLln', 'K3U2', 'Zowf', 'rFVS', '*L]q', '9lff', 'H#$4', 'dZre'];

const decryptedStrings = [];
for (let i = 0; i < rbArray.length; i++) {
  let decrypted = null;
  for (const key of keys) {
    try {
      // e -= 193 inside Lb
      const val = context.globalThis.lbDecrypted(i + 193, key);
      if (val && /^[\x20-\x7E]{2,100}$/.test(val)) {
        decrypted = { index: i + 193, key, value: val };
        break;
      }
    } catch (e) {}
  }
  if (decrypted) {
    decryptedStrings.push(decrypted);
  }
}

fs.writeFileSync('scratch/decrypted-rb-strings.json', JSON.stringify(decryptedStrings, null, 2));
console.log(`Successfully decrypted and saved ${decryptedStrings.length} strings from Rb!`);

// Print signature related strings
const sigStrings = decryptedStrings.filter(d => d.value.toLowerCase().includes('signature') || d.value.toLowerCase().includes('key') || d.value.toLowerCase().includes('time') || d.value.toLowerCase().includes('token'));
console.log('\nInteresting Rb decrypted strings:', JSON.stringify(sigStrings, null, 2));
