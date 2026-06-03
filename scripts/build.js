const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
}

// Helper to recursively copy directories
const copy = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(f => {
            // Avoid copying dist or node_modules
            if (f.toLowerCase() === 'dist' || f.toLowerCase() === 'node_modules' || f.includes('_to_delete')) return;
            copy(path.join(src, f), path.join(dest, f));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

console.log('Copying assets...');
copy('./assets', './dist/assets');

console.log('Copying HTML files and packages...');
fs.readdirSync(root).forEach((file) => {
    // Skip dist, node_modules, dotfiles
    if (file.toLowerCase() === 'dist' || file.toLowerCase() === 'node_modules' || file.startsWith('.') || file.includes('_to_delete')) return;
    
    const fullPath = path.join(root, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith('.html')) {
        fs.copyFileSync(fullPath, path.join(dist, file));
    }
    if (fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'index.html'))) {
        copy(fullPath, path.join(dist, file));
    }
});

console.log('Copying robots.txt and sitemap.xml...');
copy('./robots.txt', './dist/robots.txt');
copy('./sitemap.xml', './dist/sitemap.xml');

console.log('Syncing dist/output.css back to root output.css...');
fs.copyFileSync('./dist/output.css', './output.css');

console.log('Fixing output.css links in dist html files...');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="dist\/output\.css"/g, 'href="output.css"');
    fs.writeFileSync('./dist/' + f, content);
});

console.log('Build completed successfully!');

