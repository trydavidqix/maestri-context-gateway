import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createDashboardServer } from '../src/dashboard.mjs';

function get(port) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path: '/' }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body }));
    }).on('error', reject);
  });
}

test('dashboard exposes concise accessible status announcements without live-updating the task table', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => new Promise(resolve => server.close(resolve)));

  const page = await get(server.address().port);
  assert.equal(page.status, 200);
  assert.match(page.body, /id="health"[^>]*role="group"[^>]*aria-label="Estado dos serviços"/);
  assert.match(page.body, /<label[^>]*for="theme-select"[^>]*>Tema<\/label><select id="theme-select"/);
  assert.match(page.body, /id="task-filter-status"[^>]*class="panel-sub"[^>]*aria-live="polite"/);
  assert.doesNotMatch(page.body, /\$\('tasks'\)\.setAttribute\('aria-live'/);
  assert.match(page.body, /id="view-panel"[^>]*role="region" aria-labelledby="detail-title"/);
});

test('dashboard updates document title when changing views', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => new Promise(resolve => server.close(resolve)));

  const page = await get(server.address().port);
  assert.equal(page.status, 200);
  assert.match(page.body, /document\.title\s*=\s*.*?label\s*\+\s*['"]\s*-\s*Lumenva Context Gateway['"]/);
});
