import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scratch/anime_detail.html', 'utf-8');
const $ = cheerio.load(html);

const episodes = [];
$('.episodelist li, #episodelist li').each((i, el) => {
  const epUrl = $(el).find('a').attr('href') || '';
  if (!epUrl.includes('/episode/')) return; // Filter out batch and lengkap

  const epTitle = $(el).find('a').text().trim();
  const epSlug = epUrl.split('/').filter(Boolean).pop();
  const date = $(el).find('.zeebr').text().trim();
  
  const match = epTitle.match(/Episode\s+(\d+)/i);
  const epNum = match ? parseInt(match[1], 10) : null;

  episodes.push({ id: epSlug, title: epTitle, date, episode: epNum });
});

console.log('Total episodes found:', episodes.length);
console.log('First 5 episodes (latest):', episodes.slice(0, 5));
console.log('Last 5 episodes (oldest):', episodes.slice(-5));
