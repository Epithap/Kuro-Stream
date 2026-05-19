import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find Rb and extract its exact array string
const startTerm = 'function Rb(){let e=`';
const startIdx = content.indexOf(startTerm);
if (startIdx === -1) {
  console.error('Rb not found');
  process.exit(1);
}

const endIdx = content.indexOf('`.split(`.`);return Rb=function()', startIdx);
if (endIdx === -1) {
  console.error('Rb end not found');
  process.exit(1);
}

const arrayString = content.substring(startIdx + startTerm.length, endIdx);
console.log('Array string length:', arrayString.length);

// Write to a clean decrypter script
const decrypterScript = `
function Rb() {
  let e = \`${arrayString}\`.split('.');
  return Rb = function() { return e; }, Rb();
}

function Lb(e, t) {
  e -= 193;
  let n = Rb(), r = n[e];
  if (Lb.FwagKh === void 0) {
    var i = function(e) {
      let t = '', n = '';
      for (let n = 0, r, i, a = 0; i = e.charAt(a++); ~i && (r = n % 4 ? r * 64 + i : i, n++ % 4) && (t += String.fromCharCode(255 & r >> (-2 * n & 6))))
        i = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='.indexOf(i);
      for (let e = 0, r = t.length; e < r; e++)
        n += '%' + ('00' + t.charCodeAt(e).toString(16)).slice(-2);
      return decodeURIComponent(n);
    };
    Lb.lIkQXZ = function(e, t) {
      let n = [], r = 0, a, o = '';
      e = i(e);
      let s;
      for (s = 0; s < 256; s++) n[s] = s;
      for (s = 0; s < 256; s++) r = (r + n[s] + t.charCodeAt(s % t.length)) % 256, a = n[s], n[s] = n[r], n[r] = a;
      s = 0; r = 0;
      for (let t = 0; t < e.length; t++) s = (s + 1) % 256, r = (r + n[s]) % 256, a = n[s], n[s] = n[r], n[r] = a, o += String.fromCharCode(e.charCodeAt(t) ^ n[(n[s] + n[r]) % 256]);
      return o;
    };
    Lb.HFNctz = {};
    Lb.FwagKh = true;
  }
  let a = n[0], o = e + a, s = Lb.HFNctz[o];
  return s ? r : (Lb.HNhjCk === void 0 && (Lb.HNhjCk = true), r = Lb.lIkQXZ(r, t), Lb.HFNctz[o] = r), r;
}

function Fb(e, t) {
  return Lb(e - -46, t);
}

function t(e, key) {
  return Fb(e - -309, key);
}

console.log('--- Decrypting Signature Header Keys ---');
const part1 = t(10, '1Q1^');
const part2 = t(-155, '1!pJ');
const part3 = t(52, '0cSO');
console.log('Part 1:', part1);
console.log('Part 2:', part2);
console.log('Part 3:', part3);
console.log('Signature Key:', part1 + part2 + part3 + 'gnature');

console.log('--- Decrypting Other Variables ---');
console.log('t(96, "U96T"):', t(96, 'U96T'));
console.log('t(505, "iJ(q"):', t(505, 'iJ(q'));
console.log('t(686, "Zowf"):', t(686, 'Zowf'));
console.log('t(575, "wpLQ"):', t(575, 'wpLQ'));
console.log('t(723, "G48x"):', t(723, 'G48x'));
console.log('t(301, "9lff"):', t(301, '9lff'));
console.log('t(74, "flu#"):', t(74, 'flu#'));
console.log('t(671, "&Vgz"):', t(671, '&Vgz'));
`;

fs.writeFileSync('scratch/decrypt-sig-clean.js', decrypterScript);
console.log('Clean decrypter script written!');
