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
globalThis.csDecrypted = cs;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

const csArray = context.globalThis.csDecrypted();

// Brute force search for offset
// We want: us(1363 - offset, 'RDIL') = 'reque' or 'req'
for (let offset = -2000; offset < 2000; offset++) {
  try {
    const idx = 1363 - offset;
    // index in csArray is idx - 393
    if (idx - 393 >= 0 && idx - 393 < csArray.length) {
      const val = context.globalThis.usDecrypted(idx, 'RDIL');
      if (val === 'reque' || val === 'req' || val === 'request' || val.includes('requ')) {
        console.log(`FOUND OFFSET: ${offset}`);
        console.log(`Value: "${val}"`);
        
        // Let's decrypt the other signature key parts with this offset!
        const part1 = context.globalThis.usDecrypted(1220 - offset, '4iVX');
        const part2 = context.globalThis.usDecrypted(1697 - offset, 'J#Yc');
        const part3 = context.globalThis.usDecrypted(1375 - offset, 'RDIL');
        console.log('Signature Parts:');
        console.log('Part 1:', part1);
        console.log('Part 2:', part2);
        console.log('Part 3:', part3);
        console.log('Full string:', part1 + part2 + 'st-si' + part3 + 're');
      }
    }
  } catch (e) {}
}
