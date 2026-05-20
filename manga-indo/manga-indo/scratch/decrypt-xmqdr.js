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
  context.globalThis.lbDecrypted.HFNctz = {};
  return context.globalThis.lbDecrypted(e + 174 - -309 - -46, key);
}

console.log('--- Decrypting n.XMQDR ---');
try {
  const part1 = t(-79, 'l3mC');
  const part2 = t(-145, 'DOuN');
  const part3 = t(256, '1JJx');
  const part4 = t(237, '0cSO');
  const part5 = t(710, 'LT*@');
  const part6 = t(340, '&Vgz');
  const part7 = t(-38, '#K#r');
  console.log('part1 (-79, "l3mC"):', part1);
  console.log('part2 (-145, "DOuN"):', part2);
  console.log('part3 (256, "1JJx"):', part3);
  console.log('part4 (237, "0cSO"):', part4);
  console.log('part5 (710, "LT*@"):', part5);
  console.log('part6 (340, "&Vgz"):', part6);
  console.log('part7 (-38, "#K#r"):', part7);
  
  const full = part1 + part2 + '/d15RGXgbi' + part3 + part4 + part5 + part6 + part7;
  console.log('Full n.XMQDR:', full);
} catch (e) {
  console.error('Failed to decrypt n.XMQDR:', e.message);
}

console.log('\n--- Decrypting t(447, "CQ#9") ---');
try {
  console.log('t(447, "CQ#9") =', t(447, 'CQ#9'));
} catch (e) {
  console.error('Failed to decrypt t(447):', e.message);
}
