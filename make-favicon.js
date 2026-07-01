const TextToSVG = require('text-to-svg');
const fs = require('fs');
const https = require('https');
const fontUrl = "https://fonts.gstatic.com/s/merriweather/v33/u-4B0qyriQwlOrhSvowK_l5-eTxCVx0ZbwLvKH2Gk9hLmp0v5yA-xXPqCzLvPee1XYk_XSf-FmQlV13w.ttf";
const fontPath = "merriweather-bold-italic.ttf";

https.get(fontUrl, (res) => {
    const file = fs.createWriteStream(fontPath);
    res.pipe(file);
    file.on('finish', () => {
        file.close(() => {
            const textToSVG = TextToSVG.loadSync(fontPath);
            const attributes = { fill: '#492ced' };
            const options = {x: 0, y: 0, fontSize: 100, anchor: 'top', attributes: attributes};
            const rawSvg = textToSVG.getSVG('s', options);
            
            const filterDef = `  <defs>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feMorphology operator="dilate" radius="1.5" in="SourceAlpha" result="thickened" />
      <feGaussianBlur in="thickened" stdDeviation="2" result="blurred" />
      <feFlood flood-color="#d1a6ff" flood-opacity="1" result="glowColor" />
      <feComposite in="glowColor" in2="blurred" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>\n`;

            let modifiedSvg = rawSvg;
            // Force it to use a square viewBox and remove hardcoded width/height to avoid stretching
            modifiedSvg = modifiedSvg.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-20 30 80 80">');
            modifiedSvg = modifiedSvg.replace('><path', `>\n${filterDef}  <path filter="url(#glow)"`);
            
            fs.writeFileSync('favicon.svg', modifiedSvg);
            console.log("Done generating SVG with glow!");
        });
    });
});
