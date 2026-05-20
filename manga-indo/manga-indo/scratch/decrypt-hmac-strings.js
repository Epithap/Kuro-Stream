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

function r(e, key) {
  context.globalThis.lbDecrypted.HFNctz = {};
  // e - 556 is passed to Fb
  // Fb(val) is Lb(val + 46 + 174)
  // So Lb(e - 556 + 220) = Lb(e - 336)
  return context.globalThis.lbDecrypted(e - 336, key);
}

console.log('--- Decrypting _hmac method strings ---');
try { console.log('r(1134, "ILuX") =', r(1134, 'ILuX')); } catch(e){ console.log('r(1134) failed:', e.message); }
try { console.log('r(1270, "qD3X") =', r(1270, 'qD3X')); } catch(e){ console.log('r(1270) failed:', e.message); }
try { console.log('r(1607, "EZNS") =', r(1607, 'EZNS')); } catch(e){ console.log('r(1607) failed:', e.message); }
try { console.log('r(719, "QpsX") =', r(719, 'QpsX')); } catch(e){ console.log('r(719) failed:', e.message); }
try { console.log('r(1569, "U96T") =', r(1569, 'U96T')); } catch(e){ console.log('r(1569) failed:', e.message); }
