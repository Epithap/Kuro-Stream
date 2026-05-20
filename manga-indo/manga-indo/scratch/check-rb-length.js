import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbStartStr = 'function Rb(){';
const rbEndStr = 'Rb=function(){return e},Rb()}';

const rbStartIdx = code.indexOf(rbStartStr);
const rbEndIdx = code.indexOf(rbEndStr, rbStartIdx);

const rbCode = code.substring(rbStartIdx, rbEndIdx + rbEndStr.length);

const runner = `
${rbCode}
globalThis.rbArray = Rb();
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

console.log('Rb array length:', context.globalThis.rbArray.length);
console.log('Is element 691 present?', context.globalThis.rbArray[691] !== undefined);
console.log('Element 691 value:', context.globalThis.rbArray[691]);
console.log('First 5 elements of Rb array:', context.globalThis.rbArray.slice(0, 5));
console.log('Last 5 elements of Rb array:', context.globalThis.rbArray.slice(-5));
