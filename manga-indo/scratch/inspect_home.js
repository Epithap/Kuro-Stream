import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const url = 'https://otakudesu.blog/';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    
    console.log("=== MENUS ===");
    $('#menu-menu-utama li a, .menu li a').each((i, el) => {
      console.log($(el).text().trim(), '->', $(el).attr('href'));
    });

    console.log("\n=== POST SECTIONS / BLOCKS ===");
    $('.venser').each((i, el) => {
      const title = $(el).find('h2').first().text().trim() || $(el).find('.wtitle').first().text().trim();
      console.log(`Section ${i+1}: ${title} - classes: ${$(el).attr('class')}`);
    });
    
    console.log("\n=== SIDEBAR WIDGETS ===");
    $('#sidebar .widget, .sidebar .widget').each((i, el) => {
      console.log(`Widget ${i+1}:`, $(el).find('.widget-title, h3').text().trim());
      // Log some child links
      $(el).find('ul li a').slice(0, 3).each((j, a) => {
        console.log(`  Link: ${$(a).text().trim()} -> ${$(a).attr('href')}`);
      });
    });
  } catch (err) {
    console.error(err.message);
  }
}
run();
