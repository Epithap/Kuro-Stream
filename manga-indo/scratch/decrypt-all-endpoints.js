import fs from 'fs';
import vm from 'vm';

const runner = fs.readFileSync('scratch/decrypters-rotated.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { qo, us, ls, Lb, Fb } = context.globalThis;

// System 1 (qo / H)
function H(e, t) {
  return qo(e - 771, t);
}

// System 2 (us / ls)
// System 3 (Lb / Fb)

console.log('--- DECRYPTING API ENDPOINTS ---');

// 1. Index 30915: `/api/` + s(`k!ac`,209) + s(`(UN(`,13) + `Slug}`
function s_30915(e, t) {
  return H(t - -987, e);
}
console.log('Endpoint 1:', '/api/' + s_30915('k!ac', 209) + s_30915('(UN(', 13) + 'Slug}');

// 2. Index 39983: `/api/` + n(362,`SnQ(`) + `nts/genres`
function n_39983(e, t) {
  return H(e - -825, t);
}
console.log('Endpoint 2:', '/api/' + n_39983(362, 'SnQ(') + 'nts/genres');

console.log('Method 1 (getGenresRaw):', H(1141, '1(#P') + H(1428, '6vn*') + 'aw');
console.log('Method 2 (getGenres):', H(1009, 'DKd]') + 'nres');

