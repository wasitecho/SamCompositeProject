// tools/scrape-sam-composites.js
// Scrapes product name, category, description, and price (if present)
// from https://samcomposites.com/Products/ and writes products.json & products.csv

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ROOT = 'https://samcomposites.com';
const PRODUCTS_HOME = `${ROOT}/Products/`;

function normalizeSpace(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/[, ]/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

async function fetchHtml(url) {
  const { data } = await axios.get(url, { timeout: 25000, headers: { 'User-Agent': 'Mozilla/5.0 SamScraper' } });
  return cheerio.load(data);
}

async function discoverCategoryLinks() {
  const $ = await fetchHtml(PRODUCTS_HOME);
  const links = new Map();

  // Left nav or product list sections
  $('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    const text = normalizeSpace($(a).text());
    if (!href || !text) return;
    if (/Products\//i.test(href) || /FR4|G10|G11|GPO|Paper|Cotton|MICA|Laminates|Tubes|Cylinders|Rod/i.test(text)) {
      const url = href.startsWith('http') ? href : `${ROOT}/${href.replace(/^\/?/, '')}`;
      links.set(url, text);
    }
  });

  // Fallback: return only the main page
  if (links.size === 0) links.set(PRODUCTS_HOME, 'Products');
  return Array.from(links.entries()).slice(0, 25); // keep it reasonable
}

function pushItem(items, { name, category, description, price }) {
  if (!name) return;
  items.push({
    name: normalizeSpace(name),
    category: normalizeSpace(category || 'General'),
    description: normalizeSpace(description || `High-quality ${category || 'product'}`),
    price: price ?? 0
  });
}

async function scrapeCategory(url, fallbackCategory = 'General') {
  const $ = await fetchHtml(url);
  const items = [];

  // Heuristic category title from page
  const pageTitle = normalizeSpace($('h1, h2, .title, .page-title').first().text()) || fallbackCategory;

  // Card/list layouts
  $('.card, .product, .product-card, .item, .list-group-item, .ProductCard, .productlistrow').each((_, el) => {
    const name = normalizeSpace($(el).find('h1, h2, h3, .title, .productname, .ProductName').first().text());
    const description = normalizeSpace($(el).find('p, .description, .productdesc, .ProductShortDesc').first().text());
    const priceText = normalizeSpace($(el).find('.price, .ProductPrice, .item-price').first().text());
    const price = parsePrice(priceText);
    if (name) pushItem(items, { name, category: pageTitle, description, price });
  });

  // Fallback: bullet/anchor lists
  if (items.length === 0) {
    $('li, a').each((_, el) => {
      const text = normalizeSpace($(el).text());
      if (/^([A-Z0-9\-\/ ]{3,})$/.test(text) || /Laminates|MICA|Rod|Tube|Sheet/i.test(text)) {
        if (text.length >= 4 && text.length <= 120) {
          pushItem(items, { name: text, category: pageTitle, description: `${text} - industrial composite` });
        }
      }
    });
  }

  return items;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(p => {
    const key = `${p.category}|${p.name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function writeOutputs(items) {
  const outDir = process.cwd();
  const jsonPath = path.join(outDir, 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

  const csvPath = path.join(outDir, 'products.csv');
  const header = 'name,category,description,price\n';
  const rows = items.map(p => {
    const esc = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
    return [esc(p.name), esc(p.category), esc(p.description), p.price ?? 0].join(',');
  }).join('\n');
  fs.writeFileSync(csvPath, header + rows + '\n');

  console.log(`Saved ${items.length} items ->\n  - ${jsonPath}\n  - ${csvPath}`);
}

async function run() {
  const catLinks = await discoverCategoryLinks();
  console.log(`Discovered ${catLinks.length} category pages`);

  const all = [];
  for (const [url, text] of catLinks) {
    try {
      const items = await scrapeCategory(url, text);
      all.push(...items);
      console.log(`✓ ${text} → ${items.length}`);
    } catch (e) {
      console.warn(`⚠ Failed ${text}:`, e.message);
    }
  }

  const deduped = dedupe(all);
  writeOutputs(deduped);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


