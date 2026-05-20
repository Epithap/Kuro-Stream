import axios from 'axios';
import * as cheerio from 'cheerio';

axios.get('https://html.duckduckgo.com/html/?q=otakudesu', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}).then(r => {
    const $ = cheerio.load(r.data);
    $('.result__url').each((i, el) => console.log($(el).text().trim()));
}).catch(console.error);
