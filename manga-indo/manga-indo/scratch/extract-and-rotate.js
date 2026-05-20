import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Helper to extract a function
function extractFunction(name) {
  const startStr = `function ${name}(`;
  let startIdx = code.indexOf(startStr);
  if (startIdx === -1) {
    const startStr2 = `var ${name}=function`;
    startIdx = code.indexOf(startStr2);
    if (startIdx === -1) {
      const startStr3 = `let ${name}=function`;
      startIdx = code.indexOf(startStr3);
      if (startIdx === -1) return null;
    }
  }
  
  let braceCount = 0;
  let endIdx = startIdx;
  let foundStart = false;
  while (endIdx < code.length) {
    if (code[endIdx] === '{') {
      braceCount++;
      foundStart = true;
    } else if (code[endIdx] === '}') {
      braceCount--;
    }
    endIdx++;
    if (foundStart && braceCount === 0) {
      break;
    }
  }
  return code.substring(startIdx, endIdx);
}

// Helper to extract rotation IIFE
function extractIIFE(targetName, checksum) {
  const marker = `)(${targetName},${checksum});`;
  const endIdx = code.indexOf(marker);
  if (endIdx === -1) {
    console.log(`Could not find marker for ${targetName}, ${checksum}`);
    return '';
  }
  
  // Search backwards to find the matching start of IIFE: (function
  let startIdx = endIdx;
  while (startIdx > 0) {
    if (code.substring(startIdx).startsWith('(function(e,t){')) {
      break;
    }
    startIdx--;
  }
  
  return code.substring(startIdx, endIdx + marker.length);
}

const YoCode = extractFunction('Yo');
const YoIIFE = extractIIFE('Yo', '974627');
const qoCode = extractFunction('qo');

const csCode = extractFunction('cs');
const csIIFE = extractIIFE('cs', '534773');
const usCode = extractFunction('us');
const lsCode = extractFunction('ls');

const RbCode = extractFunction('Rb');
const RbIIFE = extractIIFE('Rb', '100005');
const LbCode = extractFunction('Lb');
const FbCode = extractFunction('Fb');

console.log('YoCode length:', YoCode?.length);
console.log('YoIIFE length:', YoIIFE?.length);
console.log('qoCode length:', qoCode?.length);

console.log('csCode length:', csCode?.length);
console.log('csIIFE length:', csIIFE?.length);
console.log('usCode length:', usCode?.length);
console.log('lsCode length:', lsCode?.length);

console.log('RbCode length:', RbCode?.length);
console.log('RbIIFE length:', RbIIFE?.length);
console.log('LbCode length:', LbCode?.length);
console.log('FbCode length:', FbCode?.length);

const runner = `
// System 1 (Yo)
${YoCode}
${qoCode}
${YoIIFE}

// System 2 (cs)
${csCode}
${usCode}
${lsCode}
${csIIFE}

// System 3 (Rb)
${RbCode}
${LbCode}
${FbCode}
${RbIIFE}

globalThis.Yo = Yo;
globalThis.qo = qo;
globalThis.cs = cs;
globalThis.us = us;
globalThis.ls = ls;
globalThis.Rb = Rb;
globalThis.Lb = Lb;
globalThis.Fb = Fb;
`;

fs.writeFileSync('scratch/decrypters-rotated.js', runner);
console.log('Saved to scratch/decrypters-rotated.js');

// Now let's run test decryption inside VM context
const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { Fb } = context.globalThis;

console.log('\n--- TESTING DECRYPTION FOR SYSTEM 3 (Fb) ---');

function t_zb(e, t) {
  return Fb(t - 851, e);
}

try {
  console.log('t_zb("!WeR", 1548) =', t_zb("!WeR", 1548));
  console.log('t_zb("wpLQ", 1131) + t_zb("6$g&", 1580) =', t_zb("wpLQ", 1131) + t_zb("6$g&", 1580));
  
  // Test Decrypted HMAC Key from class zb:
  const hgtyg = t_zb('iJ(q', 1888) + 'GVkX1' + t_zb('&EGx', 1872) + t_zb('dZre', 1387) + t_zb('9rau', 1909) + 'a4P2x' + t_zb('RDIL', 1707) + t_zb('dZre', 1195) + t_zb('l3mC', 1499) + t_zb('*L]q', 1127) + t_zb('tmg)', 1722) + t_zb('6$g&', 1330) + t_zb('60GJ', 1620);
  console.log('Decrypted HMAC Key (Hgtyg):', hgtyg);
} catch (e) {
  console.error('Error decrypting System 3:', e.stack);
}
