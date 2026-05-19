import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbStartStr = 'function Rb(){';
const rbEndStr = 'Rb=function(){return e},Rb()}';

const rbStartIdx = code.indexOf(rbStartStr);
const rbEndIdx = code.indexOf(rbEndStr, rbStartIdx);

const rbCode = code.substring(rbStartIdx, rbEndIdx + rbEndStr.length);

const lbStartStr = 'function Lb(e,t){';
const lbEndStr = 'Lb.HFNctz={},Lb.FwagKh=!0}let a=n[0],o=e+a,s=Lb.HFNctz[o];return s?r=s:(Lb.HNhjCk===void 0&&(Lb.HNhjCk=!0),r=Lb.lIkQXZ(r,t),Lb.HFNctz[o]=r),r}';

const lbStartIdx = code.indexOf(lbStartStr);
const lbEndIdx = code.indexOf(lbEndStr, lbStartIdx);

const lbCode = code.substring(lbStartIdx, lbEndIdx + lbEndStr.length);

const runner = `
${rbCode}
${lbCode}
globalThis.lbDecrypted = Lb;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

function t(e, key) {
  // function t(e,t){return Fb(e- -309,t)}
  // function Fb(e,t){return Lb(e- -46,t)}
  return context.globalThis.lbDecrypted(e - -309 - -46, key);
}

const keys = ['1Q1^', '1!pJ', '0cSO', 'XLgh', 'G48x', 'flu#', 'wpLQ', 'ipzp', 'DOuN', 'LT*@', 'J#Yc', 'RDIL', ']*We', 'U96T', 'Skig', 'EZNS', 'q$$g', 'JviX', 'cgpE', 'Zs2M', 'RbFd', 'DOuN', 'NLln', 'K3U2', 'Zowf', 'rFVS', '*L]q', '9lff', 'H#$4', 'dZre'];

const results = [];
// Loop through e from -500 to 1000
for (let e = -500; e < 1000; e++) {
  for (const key of keys) {
    try {
      const val = t(e, key);
      if (val && /^[\x20-\x7E]{2,100}$/.test(val)) {
        results.push({ e, key, val });
      }
    } catch (err) {}
  }
}

// Print results matching 'request', 'si', 'x-wm', 'signature', 'time', 'method', 'key', 'auth', 'bearer'
const matches = results.filter(r => 
  r.val.includes('request') || 
  r.val === 'si' || 
  r.val === 'x-wm-' || 
  r.val.includes('signature') || 
  r.val.includes('time') || 
  r.val.includes('method') || 
  r.val.includes('key') || 
  r.val.includes('auth') || 
  r.val.includes('bearer') ||
  r.val.includes('pathname')
);

console.log('Matches:');
console.log(JSON.stringify(matches, null, 2));

// Let's search specifically for the signature key parts in the matches!
// Part 1: t(10, '1Q1^')
// Part 2: t(-155, '1!pJ')
// Part 3: t(52, '0cSO')
console.log('\nExact evaluation of signature key parts using all possible keys:');
for (const key of keys) {
  try { console.log(`t(10, "${key}") =`, t(10, key)); } catch(e){}
  try { console.log(`t(-155, "${key}") =`, t(-155, key)); } catch(e){}
  try { console.log(`t(52, "${key}") =`, t(52, key)); } catch(e){}
}
