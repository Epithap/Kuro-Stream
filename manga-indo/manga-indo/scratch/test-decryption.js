import fs from 'fs';
import vm from 'vm';

const decrypters = fs.readFileSync('scratch/decrypters-extracted.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(decrypters, context);

const { Yo, qo, Lb, Rb, Fb, H } = context.globalThis;

console.log('--- TESTING DECRYPTION ---');

// Let's test the class zb variables first!
// function t(e,t){return Fb(t-851,e)}
function t_zb(key, val) {
  return Fb(val - 851, key);
}

try {
  console.log('WgsBD (t("!WeR", 1548)):', t_zb('!WeR', 1548));
  console.log('EMKAd (t("wpLQ", 1131) + t("6$g&", 1580)):', t_zb('wpLQ', 1131) + t_zb('6$g&', 1580));
  console.log('HvXyX (t("dZre", 1113) + t("1JJx", 1790) + "en"):', t_zb('dZre', 1113) + t_zb('1JJx', 1790) + 'en');
  
  const hgtyg = t_zb('iJ(q', 1888) + 'GVkX1' + t_zb('&EGx', 1872) + t_zb('dZre', 1387) + t_zb('9rau', 1909) + 'a4P2x' + t_zb('RDIL', 1707) + t_zb('dZre', 1195) + t_zb('l3mC', 1499) + t_zb('*L]q', 1127) + t_zb('tmg)', 1722) + t_zb('6$g&', 1330) + t_zb('60GJ', 1620);
  console.log('Hgtyg (Decrypted HMAC Key):', hgtyg);

} catch (e) {
  console.error('zb decryption error:', e.message);
}

// Let's test intercepRequest signatures/keys
// Let's search inside components-_yy6KL6v.js for what keys are decrypted inside intercepRequest!
// Let's search for "intercep" or look at the class we extracted or read it.
