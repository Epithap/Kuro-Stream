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
  context.globalThis.lbDecrypted.HFNctz = {};
  return context.globalThis.lbDecrypted(e + 174 - -46, t);
}

console.log('--- Decrypting _hmac internal calls ---');
try { console.log('Fb(578, "ILuX") =', Fb(578, 'ILuX')); } catch(e){}
try { console.log('Fb(714, "qD3X") =', Fb(714, 'qD3X')); } catch(e){}
try { console.log('Fb(1051, "EZNS") =', Fb(1051, 'EZNS')); } catch(e){}
try { console.log('Fb(163, "QpsX") =', Fb(163, 'QpsX')); } catch(e){}
try { console.log('Fb(1013, "U96T") =', Fb(1013, 'U96T')); } catch(e){}
