import fs from 'fs';

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

// We write the file directly using string concatenation to avoid template literal escaping bugs!
const output = 
  rbCode + '\n\n' + 
  lbCode + '\n\n' + 
  'function Fb(e, t) {\n' +
  '  return Lb(e - -46, t);\n' +
  '}\n\n' +
  'function t(e, key) {\n' +
  '  return Fb(e - -309, key);\n' +
  '}\n\n' +
  'console.log("--- Standalone Evaluation ---");\n' +
  'console.log("t(10, \\"1Q1^\\") =", t(10, "1Q1^"));\n' +
  'console.log("t(-155, \\"1!pJ\\") =", t(-155, "1!pJ"));\n' +
  'console.log("t(52, \\"0cSO\\") =", t(52, "0cSO"));\n' +
  'console.log("Full Header Key:", t(10, "1Q1^") + t(-155, "1!pJ") + t(52, "0cSO") + "gnature");\n';

fs.writeFileSync('scratch/decrypt-sig-standalone.js', output);
console.log('Successfully wrote standalone decrypter!');
