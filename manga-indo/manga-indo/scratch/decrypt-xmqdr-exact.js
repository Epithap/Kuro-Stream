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

console.log('--- Decrypting n.XMQDR components ---');
try { console.log('t(-79, "l3mC") =', t(-79, 'l3mC')); } catch(e){ console.log('t(-79) failed:', e.message); }
try { console.log('t(-145, "DOuN") =', t(-145, 'DOuN')); } catch(e){ console.log('t(-145) failed:', e.message); }
try { console.log('t(256, "1JJx") =', t(256, '1JJx')); } catch(e){ console.log('t(256) failed:', e.message); }
try { console.log('t(237, "0cSO") =', t(237, '0cSO')); } catch(e){ console.log('t(237) failed:', e.message); }
try { console.log('t(710, "LT*@") =', t(710, 'LT*@')); } catch(e){ console.log('t(710) failed:', e.message); }
try { console.log('t(340, "&Vgz") =', t(340, '&Vgz')); } catch(e){ console.log('t(340) failed:', e.message); }
try { console.log('t(-38, "#K#r") =', t(-38, '#K#r')); } catch(e){ console.log('t(-38) failed:', e.message); }
