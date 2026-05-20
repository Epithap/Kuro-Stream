import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scratch/episode.html', 'utf-8');
const $ = cheerio.load(html);

console.log('--- IFRAME EMBEDS ---');
$('iframe').each((i, el) => {
  console.log(`Iframe ${i + 1}: src="${$(el).attr('src')}" class="${$(el).attr('class')}" id="${$(el).attr('id')}"`);
});

console.log('\n--- MIRROR STREAMS (.mirrorstream) ---');
$('.mirrorstream').each((i, el) => {
  const quality = $(el).attr('class').split(' ').filter(c => c !== 'mirrorstream').join(' ');
  console.log(`Quality container: class="${$(el).attr('class')}"`);
  $(el).find('li').each((j, li) => {
    const a = $(li).find('a');
    console.log(`  - Option: text="${a.text().trim()}" data-id="${a.attr('data-id')}" data-post="${a.attr('data-post')}" href="${a.attr('href')}"`);
  });
});

console.log('\n--- DOWNLOAD SECTIONS (.download) ---');
$('.download').each((i, el) => {
  console.log(`Download Container ${i + 1}:`);
  $(el).find('ul').each((j, ul) => {
    $(ul).find('li').each((k, li) => {
      const qText = $(li).find('strong').text().trim();
      const links = [];
      $(li).find('a').each((_, a) => {
        links.push({ text: $(a).text().trim(), href: $(a).attr('href') });
      });
      console.log(`  - Quality: "${qText || 'Unknown'}" Links:`, links);
    });
  });
});
