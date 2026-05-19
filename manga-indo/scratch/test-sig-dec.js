import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const csIdx = code.indexOf('function cs(){');
const usIdx = code.indexOf('function us(e,t){');
const usEndIdx = code.indexOf('var ds=class', usIdx);

const csCode = code.substring(csIdx, code.indexOf('function ls', csIdx));
const usCode = code.substring(usIdx, usEndIdx !== -1 ? usEndIdx : usIdx + 2000);

const runner = `
${csCode}
${usCode}
globalThis.usDecrypted = us;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

// index - 747
const part1 = context.globalThis.usDecrypted(1220 - 747, '4iVX');
const part2 = context.globalThis.usDecrypted(1697 - 747, 'J#Yc');
const part3 = context.globalThis.usDecrypted(1375 - 747, 'RDIL');

console.log('Part 1:', part1);
console.log('Part 2:', part2);
console.log('Part 3:', part3);
console.log('Combined:', part1 + part2 + 'st-si' + part3 + 're');
