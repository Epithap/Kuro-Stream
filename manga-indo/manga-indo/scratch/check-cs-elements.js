import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const csIdx = code.indexOf('function cs(){');
const csEndIdx = code.indexOf('function ls', csIdx);
const csCode = code.substring(csIdx, csEndIdx);

const runner = `
${csCode}
globalThis.csDecrypted = cs;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

const arr = context.globalThis.csDecrypted();
console.log('cs Array Length:', arr.length);
console.log('Element at 0:', arr[0]);
console.log('Element at 100:', arr[100]);
console.log('Element at 600:', arr[600]);
console.log('Element at 625:', arr[625]);
