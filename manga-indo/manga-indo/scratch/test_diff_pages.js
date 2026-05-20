import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const url1 = `https://otakudesu.blog/?s=sub&post_type=anime`;
    const res1 = await axios.get(url1, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $1 = cheerio.load(res1.data);
    const p1_titles = [];
    $1('.chivsrc li h2').each((i, el) => p1_titles.push($1(el).text().trim()));
    console.log("Page 1 titles:", p1_titles.slice(0, 3));

    const url2 = `https://otakudesu.blog/page/2/?s=sub&post_type=anime`;
    const res2 = await axios.get(url2, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $2 = cheerio.load(res2.data);
    const p2_titles = [];
    $2('.chivsrc li h2').each((i, el) => p2_titles.push($2(el).text().trim()));
    console.log("Page 2 titles:", p2_titles.slice(0, 3));

  } catch(e) {
    console.error(e.message);
  }
}
run();
