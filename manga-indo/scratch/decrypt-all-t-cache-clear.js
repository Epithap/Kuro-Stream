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
  // Clear the cache to prevent using stale cached values from other keys!
  context.globalThis.lbDecrypted.HFNctz = {};
  return context.globalThis.lbDecrypted(e - -309 - -46, key);
}

const keys = ['1Q1^', '1!pJ', '0cSO', 'XLgh', 'G48x', 'flu#', 'wpLQ', 'ipzp', 'DOuN', 'LT*@', 'J#Yc', 'RDIL', ']*We', 'U96T', 'Skig', 'EZNS', 'q$$g', 'JviX', 'cgpE', 'Zs2M', 'RbFd', 'DOuN', 'NLln', 'K3U2', 'Zowf', 'rFVS', '*L]q', '9lff', 'H#$4', 'dZre'];

const results = [];
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

// Print results matching signature parts
const matches = results.filter(r => 
  r.val.includes('request') || 
  r.val === 'si' || 
  r.val === 'x-wm-' || 
  r.val.includes('signature') || 
  r.val.includes('time') || 
  r.val.includes('key')
);

console.log('Matches with cleared cache:');
console.log(JSON.stringify(matches, null, 2));
