// 이벤트 카드 편집기용 초간단 로컬 서버 (zero dependency)
//   - 정적 서빙: ./index.html, 그 외 파일들
//   - GET  /data : data.json 내용을 그대로 반환 (없으면 [])
//   - POST /data : 요청 본문(JSON)을 data.json에 통째로 덮어쓰기
//
// 실행:
//   node server.mjs
//   → http://localhost:3000

import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DATA_FILE = join(__dirname, 'data.json');
const PORT = Number(process.env.PORT) || 3700;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    // /data 엔드포인트
    if (req.url === '/data/info' && req.method === 'GET') {
      let info = { path: DATA_FILE, exists: false };
      if (existsSync(DATA_FILE)) {
        const s = await stat(DATA_FILE);
        info = { path: DATA_FILE, exists: true, size: s.size, mtime: s.mtime.toISOString() };
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(info));
      return;
    }
    if (req.url === '/data' && req.method === 'GET') {
      const body = existsSync(DATA_FILE) ? await readFile(DATA_FILE, 'utf8') : '[]';
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
      return;
    }
    if (req.url === '/data' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      try { JSON.parse(body); }
      catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('invalid json: ' + e.message);
        return;
      }
      await writeFile(DATA_FILE, body);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ok');
      return;
    }

    // 정적 파일
    if (req.method !== 'GET') {
      res.writeHead(405); res.end('method not allowed'); return;
    }
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    const full = normalize(join(__dirname, urlPath));
    if (!full.startsWith(__dirname)) { // path traversal 방지
      res.writeHead(403); res.end('forbidden'); return;
    }
    const data = await readFile(full);
    res.writeHead(200, { 'Content-Type': MIME[extname(full)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    if (e && e.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('not found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('server error: ' + String(e));
    }
  }
});

server.listen(PORT, () => {
  console.log(`event editor → http://localhost:${PORT}`);
  console.log(`data file    → ${DATA_FILE}`);
});
