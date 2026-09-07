const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const {renderCollection} = require('./build-collection.cjs');
const dir = fs.mkdtempSync(path.join(os.tmpdir(),'collection-check-'));
try {
  for (const [file,score] of [['low.html','45.00'],['high.html','92.00']]) fs.writeFileSync(path.join(dir,file),`<div class="big">${score}%</div><p>Overall Score: ${score}%</p>`);
  const low={file:'low.html',title:'A <paper>',authors:['A & B'],publicationDate:null};
  const high={file:'high.html',title:'Z paper',authors:['Someone'],publicationDate:'2024-01-30'};
  const html=renderCollection([low,high],dir);
  assert(html.indexOf('reports/high.html')<html.indexOf('reports/low.html'));
  assert(html.includes('92.00%') && html.includes('30 January 2024'));
  assert(html.includes('Not reported') && html.includes('A &lt;paper&gt;') && html.includes('A &amp; B'));
  assert(renderCollection([{...high,publicationDate:'2024'}],dir).includes('datetime="2024">2024</time>'));
  assert(renderCollection([{...high,publicationDate:'2024-02'}],dir).includes('February 2024'));
  assert(renderCollection([],dir).includes('No reports yet.'));
  for(const change of [{file:'../index.html'},{publicationDate:'2024-02-30'},{authors:[]},{title:''},{file:'missing.html'}]) assert.throws(()=>renderCollection([{...high,...change}],dir));
  assert.throws(()=>renderCollection([high,high],dir));
  fs.writeFileSync(path.join(dir,'high.html'),'<div class="big">92.00%</div><p>Overall Score: 93.00%</p>');
  assert.throws(()=>renderCollection([high],dir));
  console.log('PASS: descending rank, report links, score consistency, dates, escaping and invalid catalog entries.');
} finally {
  for(const file of ['low.html','high.html']) fs.unlinkSync(path.join(dir,file));
  fs.rmdirSync(dir);
}
