const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const repo = path.resolve(__dirname,'..');
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function publicationDate(value) {
  if (value === null) return 'Not reported';
  assert(typeof value === 'string' && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value),'Use YYYY, YYYY-MM, YYYY-MM-DD or null for publicationDate');
  const full = value.length===4?`${value}-01-01`:value.length===7?`${value}-01`:value;
  const date = new Date(`${full}T00:00:00Z`);
  assert(!Number.isNaN(date.valueOf()) && date.toISOString().startsWith(full),'Invalid publication date');
  const options = {year:'numeric',timeZone:'UTC'};
  if (value.length>=7) options.month='long';
  if (value.length===10) options.day='numeric';
  return `<time datetime="${value}">${new Intl.DateTimeFormat('en-GB',options).format(date)}</time>`;
}

function renderCollection(records,reportDir) {
  assert(Array.isArray(records),'Catalog must be an array');
  const files = new Set();
  const reports = records.map(record=>{
    assert(typeof record.file === 'string' && /^[a-z0-9][a-z0-9-]*\.html$/.test(record.file),'Report filename must be a lowercase HTML basename');
    assert(!files.has(record.file),'Duplicate report');files.add(record.file);
    assert(typeof record.title === 'string' && record.title.trim(),'Paper title required');
    assert(Array.isArray(record.authors) && record.authors.length && record.authors.every(a=>typeof a==='string' && a.trim()),'Paper authors required');
    const html = fs.readFileSync(path.join(reportDir,record.file),'utf8');
    const final = html.match(/Overall Score: (\d+(?:\.\d+)?)%/);
    const cover = html.match(/<div class="big(?: [a-z]+)?">(\d+(?:\.\d+)?)%<\/div>/);
    assert(final && cover && final[1]===cover[1],`Missing or inconsistent report scores: ${record.file}`);
    const score = Number(final[1]);assert(score>=0 && score<=100,'Score must be 0–100');
    return {...record,score,date:publicationDate(record.publicationDate)};
  }).sort((a,b)=>b.score-a.score || a.title.localeCompare(b.title,'en'));
  const cards = reports.map((r,i)=>{
    const color = r.score>=85?'green':r.score>=70?'yellow':r.score>=55?'orange':'red';
    return `<li><a class="report" href="reports/${r.file}" aria-labelledby="paper-${i}"><span class="rank">Rank ${i+1}</span><div class="paper"><h3 id="paper-${i}">${escape(r.title)}</h3><dl><div><dt>Authors</dt><dd>${escape(r.authors.join(', '))}</dd></div><div><dt>Published</dt><dd>${r.date}</dd></div></dl></div><div class="score ${color}"><strong>${r.score.toFixed(2)}%</strong><span>Suitability score</span></div><span class="open">Read full analysis</span></a></li>`;
  }).join('\n');
  return fs.readFileSync(path.join(__dirname,'collection.html'),'utf8').replace('{{count}}',`${reports.length} ${reports.length===1?'report':'reports'}`).replace('{{cards}}',cards || '<li class="empty">No reports yet.</li>');
}

if (require.main === module) {
  const reportDir = path.join(repo,'reports');
  const records = JSON.parse(fs.readFileSync(path.join(reportDir,'catalog.json'),'utf8'));
  const html = renderCollection(records,reportDir);
  for (const {file} of records) {
    const location = path.join(reportDir,file);
    const report = fs.readFileSync(location,'utf8');
    if (!report.includes('href="../index.html"')) {
      assert(report.includes('<main>'),'Report needs a main element');
      fs.writeFileSync(location,report.replace('<main>','<main>\n<p class="meta"><a href="../index.html">All reports</a></p>'),'utf8');
    }
  }
  fs.writeFileSync(path.join(repo,'index.html'),html,'utf8');
  console.log(`Built collection with ${records.length} reports.`);
}
module.exports = {renderCollection};
