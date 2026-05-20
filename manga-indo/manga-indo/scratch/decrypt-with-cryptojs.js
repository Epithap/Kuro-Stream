import CryptoJS from 'crypto-js';

const yb = 'LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8LuVwFghhgMGEbqptN4uY0osS45rQWHWxIZ+0oTb5jy8';
const XMQDR = 'U2FsdGVkX1/d15RGXgbiDR9ygJcJxQG6sP14ws+Uzzw=';

const hgtyg = 'U2FsdGVkX1/ziplliujoIwY5Sa4P2xhBmn3iMtnQXAqKHEnWbLYIdk9c/JZB94V0';

function bb(e) {
  if (!e) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(e, yb);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return 'Error: ' + err.message;
  }
}

console.log('Decrypted XMQDR (bb(XMQDR)):', bb(XMQDR));
console.log('Decrypted hgtyg (bb(hgtyg)):', bb(hgtyg));
