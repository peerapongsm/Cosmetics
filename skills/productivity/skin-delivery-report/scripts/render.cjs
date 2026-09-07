const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const scoreSections = require('./score-sections.cjs');
const root = path.resolve(__dirname, '..');
const rubric = JSON.parse(fs.readFileSync(path.join(root,'references/criteria.json'),'utf8'));
const sectionIds = ['summary','logic','design','permeation','release','data','strengths','critique','alternatives','topical','presentation','verdict'];
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function text(value, label) {
  assert(typeof value === 'string' && value.trim() && !value.includes('\ufffd'), `Missing or invalid ${label}`);
  return value;
}

// Accept only the small, inert HTML vocabulary used by the report content.
function fragment(value, label) {
  text(value,label);
  const stack = [];
  for (const token of value.match(/<[^>]*>|[^<]+|</g) || []) {
    if (!token.startsWith('<')) continue;
    const tag = token.match(/^<(\/?)(p|strong|em|br|div|article|h3|ul|li|table|thead|tbody|tr|th|td|a)(\s[^<>]*?)?>$/);
    assert(tag, `Unsupported HTML in ${label}: ${token}`);
    const [,closing,name,attributes=''] = tag;
    if (closing) {
      assert(!attributes && stack.pop() === name, `Unbalanced HTML in ${label}`);
      continue;
    }
    const rest = attributes.replace(/\s+(class|scope|data-label|href|style)="([^"]*)"/g, (_,key,value) => {
      if (key === 'class') assert(/^[a-z -]+$/.test(value), 'Invalid class');
      if (key === 'scope') assert(['row','col'].includes(value), 'Invalid scope');
      if (key === 'href') assert(name === 'a' && /^(https:\/\/doi\.org\/[A-Za-z0-9./_();:-]+|#top)$/.test(value), 'Only DOI links and #top are allowed');
      if (key === 'style') assert(value === 'font-size:38px', 'Unsupported inline style');
      return '';
    });
    assert(!rest.trim(), `Unsupported attributes in ${label}`);
    if (name !== 'br') stack.push(name);
  }
  assert(!stack.length, `Unclosed HTML in ${label}`);
  return value;
}

function render(data) {
  assert(Array.isArray(data.criteria) && data.criteria.length === 15, 'Exactly 15 criteria required');
  assert.equal(rubric.reduce((sum,c)=>sum+c.weight,0),100);
  const criteria = data.criteria.map((c,i) => {
    assert(Number.isFinite(c.score) && c.score >= 0 && c.score <= 100, `Invalid score ${i+1}`);
    return [rubric[i].name,c.score,rubric[i].weight,...['reported','assessment','interesting','caution','missing','evidence'].map(key=>text(c[key],`${i+1}.${key}`))];
  });
  const generated = scoreSections(criteria);
  const score = Number(generated.score);
  const summaryVerdict = score>=80?'เหมาะมาก':score>=70?'เหมาะ':score>=60?'พอใช้':score>=50?'ไม่ค่อยแนะนำ':'ไม่แนะนำ';
  const overallMeaning = score>=90?'เหมาะมาก ควรเลือก':score>=80?'เหมาะมาก มีประเด็นวิจารณ์ดี':score>=70?'เหมาะ ใช้ได้ แต่มีบางจุดต้องหา reference เพิ่ม':score>=60?'พอใช้ ต้องระวังบาง limitation':score>=50?'ไม่ค่อยแนะนำ เว้นแต่มีเหตุผลเฉพาะ':'ไม่แนะนำสำหรับ assignment นี้';
  const macros = {score:generated.score,overallMeaning,scoreColor:generated.color};
  criteria.forEach((c,i)=>{macros[`criterion${i+1}Score`]=String(c[1]);macros[`criterion${i+1}Contribution`]=(c[1]*c[2]/100).toFixed(2);});
  const expand = value => value.replace(/\{\{([^{}]+)\}\}/g,(_,key)=>{assert(Object.hasOwn(macros,key),`Unknown content placeholder: ${key}`);return macros[key];});
  const values = {...generated,scoreColor:generated.color,summaryVerdict};
  for (const key of ['title','paperTitle','summaryCaution']) values[key]=escape(text(data[key],key));
  for (const key of ['metadata','footer']) values[key]=fragment(expand(text(data[key],key)),key);
  assert(data.sections && Object.keys(data.sections).length === sectionIds.length,'Exactly 12 content sections required');
  for (const id of sectionIds) values[id]=fragment(expand(text(data.sections[id],id)),id);
  const template = fs.readFileSync(path.join(root,'assets/report.html'),'utf8');
  const html = template.replace(/\{\{([^{}]+)\}\}/g,(_,key)=>{assert(Object.hasOwn(values,key),`Unknown template placeholder: ${key}`);return values[key];});
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
  for (const link of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(link[1]),'Broken navigation');
  return html;
}

if (require.main === module) {
  const [input,output] = process.argv.slice(2);
  assert(input && output, 'Usage: node render.cjs report.json output.html (output must not exist)');
  const html = render(JSON.parse(fs.readFileSync(input,'utf8')));
  fs.writeFileSync(output,html,{encoding:'utf8',flag:'wx'});
  console.log(`Created ${output}`);
}
module.exports = {render};
