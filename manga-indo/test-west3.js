import axios from 'axios';

async function run() {
  try {
    const html = await axios.get('https://westmanga.co/', {headers: {'User-Agent': 'Mozilla/5.0'}});
    const links = html.data.match(/href="([^"]+)"/g);
    console.log(links.filter(l => l.includes('assets') === false && l.includes('http') === false));
  } catch(e) {
    console.error(e.message);
  }
}
run();
