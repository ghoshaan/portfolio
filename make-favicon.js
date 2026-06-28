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
            const svg = textToSVG.getSVG('s', options);
            fs.writeFileSync('favicon.svg', svg);
            console.log("Done generating SVG!");
        });
    });
});
