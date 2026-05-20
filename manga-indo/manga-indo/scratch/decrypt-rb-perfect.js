import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbStartStr = 'function Rb(){';
const rbEndStr = 'Rb=function(){return e},Rb()}';

const rbStartIdx = code.indexOf(rbStartStr);
const rbEndIdx = code.indexOf(rbEndStr, rbStartIdx);

if (rbStartIdx === -1 || rbEndIdx === -1) {
  console.error('Could not find exact Rb bounds');
  process.exit(1);
}

const rbCode = code.substring(rbStartIdx, rbEndIdx + rbEndStr.length);
console.log('Clean Rb Code Length:', rbCode.length);
console.log('Rb Code contains import:', rbCode.includes('import'));

// Do the same for Lb
const lbStartStr = 'function Lb(e,t){';
const lbEndStr = 'Lb.HFNctz={},Lb.FwagKh=!0}let a=n[0],o=e+a,s=Lb.HFNctz[o];return s?r=s:(Lb.HNhjCk===void 0&&(Lb.HNhjCk=!0),r=Lb.lIkQXZ(r,t),Lb.HFNctz[o]=r),r}';

const lbStartIdx = code.indexOf(lbStartStr);
const lbEndIdx = code.indexOf(lbEndStr, lbStartIdx);

if (lbStartIdx === -1 || lbEndIdx === -1) {
  console.error('Could not find exact Lb bounds');
  process.exit(1);
}

const lbCode = code.substring(lbStartIdx, lbEndIdx + lbEndStr.length);
console.log('Clean Lb Code Length:', lbCode.length);
console.log('Lb Code contains import:', lbCode.includes('import'));

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
