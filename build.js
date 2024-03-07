// update version in justgage.html and justgage.js

const fs = require('node:fs');
const pack = require('./package.json');

const html = fs.readFileSync(`${__dirname}/widgets/map.html`, 'utf8');
const newHtml = html.replace(/version: "\d+\.\d+\.\d+"/, `version: "${pack.version}"`);
if (html !== newHtml) {
    fs.writeFileSync(`${__dirname}/widgets/map.html`, newHtml);
    console.log('map.html updated');
}
