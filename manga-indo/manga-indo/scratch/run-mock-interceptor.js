import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find Fb definition in the bundle to run it
const fbIdx = code.indexOf('function Fb(');
let fbCode = '';
if (fbIdx !== -1) {
  fbCode = code.substring(fbIdx, code.indexOf('function ', fbIdx + 10));
  console.log('Fb code length:', fbCode.length);
}

// Let's locate the entire intercepRequest function definition!
// It starts with async[Fb(428,`!WeR`)+Fb(922,`G48x`)+Fb(520,`flu#`)+`t`](e){
const targetStart = 'async[Fb(428';
const startIdx = code.indexOf(targetStart);

if (startIdx === -1) {
  console.error('Could not find intercepRequest definition');
  process.exit(1);
}

// Let's extract the next 5000 characters from startIdx to cover the function
const funcCode = code.substring(startIdx, startIdx + 3000);

// We need the enclosing functions and arrays: cs(), us(), ls() and Fb()!
const csIdx = code.indexOf('function cs(){');
const csCode = code.substring(csIdx, code.indexOf('function ls', csIdx));

const usIdx = code.indexOf('function us(e,t){');
const usEndIdx = code.indexOf('var ds=class', usIdx);
const usCode = code.substring(usIdx, usEndIdx !== -1 ? usEndIdx : usIdx + 2000);

const lsIdx = code.indexOf('function ls(');
const lsCode = code.substring(lsIdx, lsIdx + 300);

const runner = `
${csCode}
${usCode}
${lsCode}
${fbCode}

// Let's create our class mock
class MockClient {
  configuration = {
    apiKey: (name) => {
      if (name === 'x-wm-accses-key') return 'WM_WEB_FRONT_END';
      return '';
    }
  };

  async [Fb(208, 'XLgh')](e, t) {
    // This is the HMAC SHA256 signer or similar!
    // Let's print its arguments!
    console.log('--- HMAC Signer Called ---');
    console.log('Arg 1 (key?):', e);
    console.log('Arg 2 (payload?):', t);
    
    // We can simulate its behavior by evaluating the function body!
    // The function body:
    // let n = vb.default.HmacSHA256(e, t)
    // return vb.default.enc.Hex.stringify(n)
    // Let's just return a placeholder, or try to run the original CryptoJS if imported.
    return 'MOCK_SIGNATURE';
  }
  
  ${funcCode}
}

globalThis.MockClient = MockClient;
globalThis.Fb = Fb;
`;

const context = vm.createContext({
  globalThis: {},
  console: {
    log: (...args) => console.log('VM Log:', ...args),
    error: (...args) => console.error('VM Error:', ...args)
  },
  Math: Math,
  Date: Date,
  URL: URL
});

try {
  vm.runInContext(runner, context);
  console.log('Successfully evaluated MockClient!');
  
  const Fb = context.globalThis.Fb;
  const client = new context.globalThis.MockClient();
  
  // Let's get the property name of intercepRequest
  const propName = Fb(428, '!WeR') + Fb(922, 'G48x') + Fb(520, 'flu#') + 't';
  console.log('intercepRequest property name:', propName);
  
  // Let's call the function!
  const req = {
    headers: {},
    method: 'GET',
    url: 'https://data.mantweh.online/api/contents/home-data'
  };
  
  console.log('Calling intercepRequest on mock request...');
  client[propName](req).then(res => {
    console.log('Result headers:', JSON.stringify(res.headers, null, 2));
  }).catch(e => {
    console.error('Call failed:', e.stack);
  });
  
} catch (e) {
  console.error('Execution failed:', e.stack);
}
