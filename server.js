/**
 * Newsletter Studio — zero-dependency Node.js server
 * Uses: http, fs, path, crypto (all built-in)
 * Storage: newsletters.json (flat file DB)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_FILE = path.join(__dirname, 'newsletters.json');

// ── JSON file "database" ──────────────────────────────────────────────────────
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function newId() {
  return crypto.randomBytes(4).toString('hex'); // e.g. "a3f91c2b"
}

// ── MIME types ────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

// ── Router ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // POST /api/newsletters — create
    if (method === 'POST' && pathname === '/api/newsletters') {
      const body = await readBody(req);
      if (!body.data) return json(res, 400, { error: 'No data provided' });
      const id = newId();
      const db = loadDB();
      db[id] = { id, data: body.data, created_at: Date.now() };
      saveDB(db);
      return json(res, 201, { id, url: `/n/${id}` });
    }

    // PUT /api/newsletters/:id — update
    const putMatch = pathname.match(/^\/api\/newsletters\/([a-z0-9]+)$/);
    if (method === 'PUT' && putMatch) {
      const id = putMatch[1];
      const body = await readBody(req);
      if (!body.data) return json(res, 400, { error: 'No data provided' });
      const db = loadDB();
      if (!db[id]) return json(res, 404, { error: 'Newsletter not found' });
      db[id].data = body.data;
      saveDB(db);
      return json(res, 200, { id, url: `/n/${id}` });
    }

    // GET /api/newsletters/:id — read
    const getMatch = pathname.match(/^\/api\/newsletters\/([a-z0-9]+)$/);
    if (method === 'GET' && getMatch) {
      const id = getMatch[1];
      const db = loadDB();
      const entry = db[id];
      if (!entry) return json(res, 404, { error: 'Newsletter not found' });
      return json(res, 200, entry.data);
    }

    // GET /n/:id — viewer SPA
    const viewMatch = pathname.match(/^\/n\/[a-z0-9]+$/);
    if (method === 'GET' && viewMatch) {
      return serveFile(res, path.join(PUBLIC_DIR, 'view.html'));
    }

    // GET / — builder SPA
    if (method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    }

    // Static files
    if (method === 'GET') {
      const filePath = path.join(PUBLIC_DIR, pathname);
      // Security: prevent path traversal
      if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403); return res.end('Forbidden');
      }
      return serveFile(res, filePath);
    }

    res.writeHead(404);
    res.end('Not found');

  } catch (err) {
    console.error(err);
    json(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`\n🌿 Newsletter Studio`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
