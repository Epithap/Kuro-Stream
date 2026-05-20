import fs from 'fs';
import vm from 'vm';

// Load components JS file
const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find cs() and us() definitions in the file
const csIdx = code.indexOf('function cs(){');
const usIdx = code.indexOf('function us(e,t){');

if (csIdx === -1 || usIdx === -1) {
  console.error('Could not find cs or us function in bundle');
  process.exit(1);
}

// Let's locate the end of us function
const usEndIdx = code.indexOf('var ds=class', usIdx);

const csCode = code.substring(csIdx, code.indexOf('function ls', csIdx));
const usCode = code.substring(usIdx, usEndIdx !== -1 ? usEndIdx : usIdx + 2000);

console.log('CS length:', csCode.length);
console.log('US length:', usCode.length);

// Let's construct a runner script
const runner = `
${csCode}
${usCode}

// Let's export us to the global context
globalThis.usDecrypted = us;
globalThis.csDecrypted = cs;
`;

const context = vm.createContext({
  globalThis: {},
  console: console
});

try {
  vm.runInContext(runner, context);
  console.log('Successfully evaluated cs and us!');
  
  const decryptedStrings = [];
  const csArray = context.globalThis.csDecrypted();
  console.log('cs array size:', csArray.length);
  
  // Let's decrypt some common keys used in request signature
  // In fetchApi:
  // n(`4iVX`, 1220) -> us(1220 - 665, `4iVX`) = us(555, `4iVX`)
  // n(`J#Yc`, 1697) -> us(1697 - 665, `J#Yc`) = us(1032, `J#Yc`)
  // n(`RDIL`, 1375) -> us(1375 - 665, `RDIL`) = us(710, `RDIL`)
  
  const signatureKeyPart1 = context.globalThis.usDecrypted(555, '4iVX');
  const signatureKeyPart2 = context.globalThis.usDecrypted(1032, 'J#Yc');
  const signatureKeyPart3 = context.globalThis.usDecrypted(710, 'RDIL');
  
  console.log('Decrypted Parts:');
  console.log('Part 1:', signatureKeyPart1);
  console.log('Part 2:', signatureKeyPart2);
  console.log('Part 3:', signatureKeyPart3);
  console.log('Full string:', signatureKeyPart1 + signatureKeyPart2 + 'st-si' + signatureKeyPart3 + 're');
  
  // Let's decrypt the entire array!
  const keys = ['4iVX', 'J#Yc', 'RDIL', 'SO0G', 'ukmY', 'whlL', 'TOV]', 'pi12', 'FW#N', 'DwLF', 'K5v3', 'l0Ni', '3N!H', '])Qd', 't1*]', 'fTTr', 'zxJC', 'ahgL', 'c]Qv', 'EZNS'];
  
  const allDecrypted = [];
  for (let i = 0; i < csArray.length; i++) {
    const rawVal = csArray[i];
    let decrypted = null;
    // Try different keys until one successfully decrypts to printable ASCII
    for (const key of keys) {
      try {
        const val = context.globalThis.usDecrypted(i + 393, key);
        if (val && /^[\x20-\x7E]+$/.test(val)) {
          decrypted = { index: i + 393, key, value: val };
          break;
        }
      } catch (e) {}
    }
    if (decrypted) {
      allDecrypted.push(decrypted);
    }
  }
  
  fs.writeFileSync('scratch/decrypted-strings.json', JSON.stringify(allDecrypted, null, 2));
  console.log(`Successfully decrypted and saved ${allDecrypted.length} strings!`);
  
  // Print strings containing HMAC or sha256 or signature or secret keys
  const interesting = allDecrypted.filter(d => 
    d.value.toLowerCase().includes('hmac') || 
    d.value.toLowerCase().includes('sha256') || 
    d.value.toLowerCase().includes('secret') || 
    d.value.toLowerCase().includes('key') ||
    d.value.toLowerCase().includes('signature')
  );
  console.log('\nInteresting decrypted strings:', JSON.stringify(interesting, null, 2));
  
} catch (e) {
  console.error('VM Evaluation Failed:', e.message);
}
