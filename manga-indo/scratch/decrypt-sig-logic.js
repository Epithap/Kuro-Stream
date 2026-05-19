import fs from 'fs';
import vm from 'vm';

const runner = fs.readFileSync('scratch/decrypters-rotated.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { Fb } = context.globalThis;

function t(e, t_name) {
  return Fb(e - -309, t_name);
}

console.log('--- DECRYPTING VARIABLES IN _intercepRequest ---');
console.log('n.EIlDm(Date[t(396, "K3U2")](), 1e3):');
console.log('t(396, "K3U2") =', t(396, 'K3U2')); // now?
console.log('t(597, "l3mC") =', t(597, 'l3mC')); // floor?

console.log('t(434, "60GJ") =', t(434, '60GJ')); // wait, what is n[t(434, "60GJ")]? Let's check what value of wkvDp is!
// In our print: wkvDp:t(737,`K3U2`)+`i-req`+t(308,`60GJ`)
// Let's decrypt wkvDp:
console.log('t(737, "K3U2") =', t(737, 'K3U2'));
console.log('t(308, "60GJ") =', t(308, '60GJ'));

console.log('t(473, "XLgh") =', t(473, 'XLgh')); // meth? i.e. method!
console.log('t(447, "CQ#9") =', t(447, 'CQ#9')); // GET?

console.log('t(638, "G48x") =', t(638, 'G48x')); // url!

console.log('t(427, "1Q1^") =', t(427, '1Q1^')); // toStr?
console.log('t(648, "6$g&") =', t(648, '6$g&')); // ing? i.e. toString!

console.log('t(684, "&EGx") =', t(684, '&EGx')); // ame? i.e. pathname!

console.log('t(96, "U96T") =', t(96, 'U96T')); // appC?
console.log('t(505, "iJ(q") =', t(505, 'iJ(q')); // onfig? i.e. appConfig!

console.log('t(686, "Zowf") =', t(686, 'Zowf')); // apiK?
console.log('t(575, "wpLQ") =', t(575, 'wpLQ')); // ey? i.e. apiKey!

console.log('t(-36, "ipzp") =', t(-36, 'ipzp')); // hFKbe / h?
console.log('t(235, "JviX") =', t(235, 'JviX')); // JQXji / +?
console.log('t(426, "1!pJ") =', t(426, '1!pJ')); // +?
console.log('t(-43, "&EGx") =', t(-43, '&EGx')); // qyPZM / call?
console.log('t(299, "*L]q") =', t(299, '*L]q')); // key?

console.log('t(257, "&Vgz") =', t(257, '&Vgz')); // decrypt / encrypt / sign?

console.log('t(42, "flu#") =', t(42, 'flu#')); // head? i.e. headers!
console.log('t(84, "qD3X") =', t(84, 'qD3X')); // toStr?
console.log('t(400, "rFVS") =', t(400, 'rFVS')); // ing? i.e. toString!

console.log('t(507, "H#$4") =', t(507, 'H#$4')); // head? i.e. headers!
console.log('t(723, "G48x") =', t(723, 'G48x')); // appC?
console.log('t(301, "9lff") =', t(301, '9lff')); // onfig?
console.log('t(74, "flu#") =', t(74, 'flu#')); // apiA?
console.log('t(671, "&Vgz") =', t(671, '&Vgz')); // cces? i.e. apiAccessKey / apiAccess?

console.log('t(351, "LT*@") =', t(351, 'LT*@')); // head? i.e. headers!
console.log('t(223, "6$g&") =', t(223, '6$g&')); // request-signature!
