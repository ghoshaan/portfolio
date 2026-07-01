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
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feFlood flood-color="#d1a6ff" flood-opacity="0.9" result="glowColor" />
      <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>\n`;

            const modifiedSvg = rawSvg.replace('><path', `>\n${filterDef}  <path filter="url(#glow)"`);
            fs.writeFileSync('favicon.svg', modifiedSvg);
            console.log("Done generating SVG with glow!");
        });
    });
});
