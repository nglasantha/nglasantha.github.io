const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../../articles');
const outputFile = path.join(__dirname, '../../articles.json');

try {
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
    const articles = files.map(file => {
        const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
        const lines = content.split('\n');

        let metadata = {};
        let inFrontmatter = false;

        for (const line of lines) {
            if (line.trim() === '---') {
                if (inFrontmatter) break; // End of frontmatter
                inFrontmatter = true;
                continue;
            }
            if (inFrontmatter) {
                const [key, ...value] = line.split(':');
                if (key && value) {
                    metadata[key.trim()] = value.join(':').trim().replace(/"/g, '');
                }
            }
        }

        return {
            file: file,
            title: metadata.title || 'Untitled',
            date: metadata.date || '',
            category: metadata.category || 'Blog',
            summary: metadata.summary || ''
        };
    });

    // Sort by date descending
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
    console.log(`Generated articles.json with ${articles.length} articles.`);

} catch (error) {
    console.error('Error generating articles.json:', error);
    process.exit(1);
}
