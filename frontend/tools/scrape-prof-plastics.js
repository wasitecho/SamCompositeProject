// tools/scrape-prof-plastics.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
  
const LISTING_URLS = [
  'https://samcomposites.com/Products/',
  'https://samcomposites.com/Products/FR4.php'
];

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/[, ]/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

async function scrapeListing(url, defaultCategory) {
  const { data } = await axios.get(url, { timeout: 20000 });
  const $ = cheerio.load(data);

  const items = [];

  // Generic selectors; may need tweaks if site markup changes
  $('.product, .item, .productlistrow, .category-item, .ProductCard').each((_, el) => {
    const name = $(el).find('h3, h2, .productname, .item-title, .ProductName').first().text().trim();
    const description = $(el).find('.description, .productdesc, p, .ProductShortDesc').first().text().trim();
    const priceText = $(el).find('.price, .ProductPrice, .item-price').first().text().trim();

    if (!name) return;

    items.push({
      name,
      category: defaultCategory,
      description: description || `High-quality ${defaultCategory.toLowerCase()} from Professional Plastics.`,
      price: parsePrice(priceText) ?? 0
    });
  });

  // Fallback if above selectors miss; try listing links
  if (items.length === 0) {
    $('a').each((_, a) => {
      const name = $(a).text().trim();
      if (name && name.length > 5 && /plastic|sheet|rod|tube|film/i.test(name)) {
        items.push({
          name,
          category: defaultCategory,
          description: `Industrial ${defaultCategory.toLowerCase()} – scraped`,
          price: 0
        });
      }
    });
  }

  return items;
}

async function run() {
  const all = [];

  for (const url of LISTING_URLS) {
    let category = 'General';
    if (url.toLowerCase().includes('sheet')) category = 'Sheet';
    else if (url.toLowerCase().includes('rod')) category = 'Rod';
    else if (url.toLowerCase().includes('tube')) category = 'Tubing';
    else if (url.toLowerCase().includes('film')) category = 'Film';

    try {
      const items = await scrapeListing(url, category);
      all.push(...items);
      console.log(`✓ ${category}: ${items.length} items`);
    } catch (e) {
      console.warn(`⚠ Failed ${category}:`, e.message);
    }
  }

  // Deduplicate by name
  const seen = new Set();
  const deduped = all.filter(p => {
    const key = p.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  fs.writeFileSync('products.json', JSON.stringify(deduped, null, 2));
  console.log(`Saved ${deduped.length} products to products.json`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});