import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbIdx = code.indexOf('function Rb(){');
const rbEndIdx = code.indexOf('function Fb', rbIdx);
const rbCode = code.substring(rbIdx, rbEndIdx);

const lbIdx = code.indexOf('function Lb(');
const lbEndIdx = code.indexOf('var ds=class', lbIdx);
const lbCode = code.substring(lbIdx, lbEndIdx !== -1 ? lbEndIdx : lbIdx + 2000);

console.log('rbCode includes import:', rbCode.includes('import'));
console.log('lbCode includes import:', lbCode.includes('import'));
