const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {render} = require('./render.cjs');
const example = JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/example-wang.json'),'utf8'));
const html = render(example);
assert(html.includes('Overall Score: 68.00%'));
assert.equal((html.match(/class="detail"/g)||[]).length,15);
assert.equal((html.match(/<section /g)||[]).length,14);
for (const score of [0,49,50,55,60,69,70,75,80,85,90,100]) {
  const data = structuredClone(example);
  data.criteria.forEach(c=>c.score=score);
  const result=render(data);
  assert(result.includes(`Overall Score: ${score.toFixed(2)}%`));
  const color=score>=85?'green':score>=70?'yellow':score>=55?'orange':'red';
  assert(result.includes(`class="big ${color}"`));
  const meaning=score>=90?'เหมาะมาก ควรเลือก':score>=80?'เหมาะมาก มีประเด็นวิจารณ์ดี':score>=70?'เหมาะ ใช้ได้ แต่มีบางจุดต้องหา reference เพิ่ม':score>=60?'พอใช้ ต้องระวังบาง limitation':score>=50?'ไม่ค่อยแนะนำ เว้นแต่มีเหตุผลเฉพาะ':'ไม่แนะนำสำหรับ assignment นี้';
  assert(result.includes(`<p>${meaning}</p>`));
}
for (const mutate of [d=>d.criteria.pop(),d=>d.criteria[0].score=101,d=>d.criteria[0].score='70',d=>d.criteria[0].evidence='',d=>delete d.sections.release,d=>d.sections.summary='<script>alert(1)</script>',d=>d.sections.summary='<p onclick="bad()">x</p>',d=>d.sections.summary='<a href="javascript:bad()">x</a>',d=>d.sections.summary='<p>unclosed',d=>d.sections.summary='<p>{{unknown}}</p>']) {
  const data=structuredClone(example);mutate(data);assert.throws(()=>render(data));
}
const escaped=structuredClone(example);escaped.criteria[0].reported='<script>alert(1)</script>';
assert(render(escaped).includes('&lt;script&gt;'));
console.log('PASS: baseline, scoring boundaries, required evidence, HTML validation, escaping, navigation.');
