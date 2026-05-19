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

// Helper for t(e, t)
function t(e, key) {
  return context.globalThis.lbDecrypted(e + 355, key);
}

console.log('--- Decrypting Signature Header Key ---');
const part1 = t(10, '1Q1^');
const part2 = t(-155, '1!pJ');
const part3 = t(52, '0cSO');

console.log('Part 1:', part1);
console.log('Part 2:', part2);
console.log('Part 3:', part3);
console.log('Signature Key:', part1 + part2 + part3 + 'gnature');

console.log('--- Decrypting intercepRequest local variables ---');
// From the dump:
// a=e[t(473,`XLgh`)+`d`]||n[t(447,`CQ#9`)]
// o=new URL(e[t(638,`G48x`)]),
// s=n[t(-36,`ipzp`)](n.JQXji(n[t(235,`JviX`)](n[t(426,`1!pJ`)](r[t(427,`1Q1^`)+t(648,`6$g&`)](),a),o[`pathn`+t(684,`&EGx`)]),this[t(96,`U96T`)+t(505,`iJ(q`)][t(686,`Zowf`)+t(575,`wpLQ`)]||``)
// c=await this[t(257,`&Vgz`)](i,s)
// e[t(42,`flu#`)+`rs`][n.TaxZs]=r[t(84,`qD3X`)+t(400,`rFVS`)]()
// e[t(507,`H#$4`)+`rs`][n[t(159,`rFVS`)]]=this[t(723,`G48x`)+t(301,`9lff`)][t(74,`flu#`)+t(671,`&Vgz`)]||``
// e[t(351,`LT*@`)+`rs`][n[t(223,`6$g&`)]]=c

console.log('t(473, "XLgh"):', t(473, 'XLgh'));
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
