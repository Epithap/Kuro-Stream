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
  // Apply the 174 offset!
  return context.globalThis.lbDecrypted(e + 174 - -309 - -46, key);
}

console.log('--- Decrypting with 174 Offset ---');
try { console.log('t(117, "eXA!") =', t(117, 'eXA!')); } catch(e){ console.log('t(117) failed:', e.message); }
try { console.log('t(-94, "4iVX") =', t(-94, '4iVX')); } catch(e){ console.log('t(-94) failed:', e.message); }
try { console.log('t(248, "ipzp") =', t(248, 'ipzp')); } catch(e){ console.log('t(248) failed:', e.message); }
try { console.log('t(159, "rFVS") =', t(159, 'rFVS')); } catch(e){ console.log('t(159) failed:', e.message); }
try { console.log('t(723, "G48x") =', t(723, 'G48x')); } catch(e){ console.log('t(723) failed:', e.message); }
try { console.log('t(301, "9lff") =', t(301, '9lff')); } catch(e){ console.log('t(301) failed:', e.message); }
try { console.log('t(74, "flu#") =', t(74, 'flu#')); } catch(e){ console.log('t(74) failed:', e.message); }
try { console.log('t(671, "&Vgz") =', t(671, '&Vgz')); } catch(e){ console.log('t(671) failed:', e.message); }
try { console.log('t(223, "6$g&") =', t(223, '6$g&')); } catch(e){ console.log('t(223) failed:', e.message); }
try { console.log('t(-36, "ipzp") =', t(-36, 'ipzp')); } catch(e){ console.log('t(-36) failed:', e.message); }
try { console.log('t(257, "&Vgz") =', t(257, '&Vgz')); } catch(e){ console.log('t(257) failed:', e.message); }
