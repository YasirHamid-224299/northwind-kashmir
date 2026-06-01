const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.northwindkashmir.com';
const rootDir = path.join(__dirname, '..');

function getHtmlFiles(directory, basePath = '') {
    const items = fs.readdirSync(directory).filter((name) => !name.startsWith('.'));
    return items.flatMap((name) => {
        const fullPath = path.join(directory, name);
        const relativePath = basePath ? `${basePath}/${name}` : name;

        if (fs.statSync(fullPath).isDirectory()) {
            return getHtmlFiles(fullPath, relativePath);
        }

        if (name.endsWith('.html')) {
            return [relativePath];
        }

        return [];
    });
}

const publicPages = getHtmlFiles(rootDir).sort();

const urls = publicPages.map((relativePath) => {
    let url = `${siteUrl}/${relativePath}`;
    if (relativePath === 'index.html') {
        url = `${siteUrl}/`;
    } else if (relativePath.endsWith('/index.html')) {
        url = `${siteUrl}/${relativePath.replace(/\/index\.html$/, '/')}`;
    }

    const stats = fs.statSync(path.join(rootDir, relativePath));
    const lastmod = stats.mtime.toISOString().slice(0, 10);
    const priority = relativePath === 'index.html' ? '1.0' : '0.8';

    return {
        loc: url,
        lastmod,
        changefreq: 'weekly',
        priority,
    };
});

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((entry) => `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`),
    '</urlset>',
].join('\n');

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');
console.log('Generated sitemap.xml for', urls.length, 'pages');
