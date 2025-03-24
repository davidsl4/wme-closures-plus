import { createServer } from 'node:http';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'node:process';

const PORT = 3000;
const DIST_DIR = './dist';

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (url.pathname === '/install-dev.user.js') {
      const template = await readFile('tampermonkey.dev-template.js', 'utf-8');
      const script = template
        .replaceAll('{{PORT}}', PORT.toString())
        .replaceAll('{{DIST}}', join(cwd(), DIST_DIR));
      res.setHeader('Content-Type', 'application/javascript');
      res.writeHead(200);
      res.end(script);
      return;
    }

    if (url.pathname.endsWith('.user.js')) {
      const content = await readFile(
        join(DIST_DIR, url.pathname.split('/').pop()),
        'utf-8',
      );
      res.setHeader('Content-Type', 'application/javascript');
      res.writeHead(200);
      res.end(content);
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  } catch {
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(
    `Install development userscript at: http://localhost:${PORT}/install-dev.user.js`,
  );
});
