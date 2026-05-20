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

function Fb(e, t) {
  // Clear cache inside Lb
  context.globalThis.lbDecrypted.HFNctz = {};
  return context.globalThis.lbDecrypted(e - -46, t);
}

function t(e, key) {
  return Fb(e - -309, key);
}

console.log('--- Evaluating n.XMQDR components directly using Fb/Lb definitions ---');
try {
  const p1 = t(-79, 'l3mC');
  const p2 = t(-145, 'DOuN');
  const p3 = '/d15RGXgbi';
  const p4 = t(256, '1JJx');
  const p5 = t(237, '0cSO');
  const p6 = t(710, 'LT*@');
  const p7 = t(340, '&Vgz');
  const p8 = t(-38, '#K#r');
  
  console.log('Part 1:', p1);
  console.log('Part 2:', p2);
  console.log('Part 3:', p3);
  console.log('Part 4:', p4);
  console.log('Part 5:', p5);
  console.log('Part 6:', p6);
  console.log('Part 7:', p7);
  console.log('Part 8:', p8);
  
  const full = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;
  console.log('Full XMQDR:', full);
} catch (e) {
  console.error('Error:', e.message);
}
