import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const startStr = 'function Rb(){';
const endStr = 'function Fb(e,t){return Lb(e- -46,t)}';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find start or end index');
  process.exit(1);
}

const cleanBlock = code.substring(startIdx, endIdx + endStr.length);
console.log('cleanBlock length:', cleanBlock.length);

const runner = `
${cleanBlock}
globalThis.realFb = Fb;
globalThis.realLb = Lb;
globalThis.realRb = Rb;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

function t(e, key) {
  // function t(e,t){return Fb(e- -309,t)}
  return context.globalThis.realFb(e - -309, key);
}

console.log('--- Decrypting with real Fb/Lb ---');
console.log('t(10, "1Q1^"):', t(10, '1Q1^'));
console.log('t(-155, "1!pJ"):', t(-155, '1!pJ'));
console.log('t(52, "0cSO"):', t(52, '0cSO'));
console.log('Signature Key:', t(10, '1Q1^') + t(-155, '1!pJ') + t(52, '0cSO') + 'gnature');

console.log('\nt(473, "XLgh"):', t(473, 'XLgh'));
console.log('t(447, "CQ#9"):', t(447, 'CQ#9'));
console.log('t(638, "G48x"):', t(638, 'G48x'));
console.log('t(-36, "ipzp"):', t(-36, 'ipzp'));
console.log('t(235, "JviX"):', t(235, 'JviX'));
console.log('t(426, "1!pJ"):', t(426, '1!pJ'));
console.log('t(427, "1Q1^"):', t(427, '1Q1^'));
console.log('t(648, "6$g&"):', t(648, '6$g&'));
console.log('t(684, "&EGx"):', t(684, '&EGx'));
console.log('t(96, "U96T"):', t(96, 'U96T'));
console.log('t(505, "iJ(q"):', t(505, 'iJ(q'));
console.log('t(686, "Zowf"):', t(686, 'Zowf'));
console.log('t(575, "wpLQ"):', t(575, 'wpLQ'));
console.log('t(257, "&Vgz"):', t(257, '&Vgz'));
console.log('t(42, "flu#"):', t(42, 'flu#'));
console.log('t(84, "qD3X"):', t(84, 'qD3X'));
console.log('t(400, "rFVS"):', t(400, 'rFVS'));
console.log('t(507, "H#$4"):', t(507, 'H#$4'));
console.log('t(159, "rFVS"):', t(159, 'rFVS'));
console.log('t(723, "G48x"):', t(723, 'G48x'));
console.log('t(301, "9lff"):', t(301, '9lff'));
console.log('t(74, "flu#"):', t(74, 'flu#'));
console.log('t(671, "&Vgz"):', t(671, '&Vgz'));
console.log('t(351, "LT*@"):', t(351, 'LT*@'));
console.log('t(223, "6$g&"):', t(223, '6$g&'));
