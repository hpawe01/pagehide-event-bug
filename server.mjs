import { readFileSync } from 'fs';
import { createServer } from 'http';

const host = 'localhost'
const port = 8000

let counter = 0;
let openConnections = 0;

const requestListener = (req, res) => {
  switch (req.url) {
    case '/sse':
      return sseRequestHandler(req, res)
    case '/favicon.ico':
      res.writeHead(200)
      return res.end('')
    default:
      return htmlRequestHandler(req, res)
  }
}

const sseRequestHandler = (req, res) => {
  openConnections++
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  const connectionCounter = ++counter;
  console.log('New SSE connection', connectionCounter, `(currently open: ${openConnections})`);

  res.writeHead(200)
  res.write(`data: ${openConnections}\n\n`)

  req.on('close', () => {
    console.log('SSE connection closed', connectionCounter, `(currently open: ${openConnections})`)
    openConnections--
  })
}

const htmlRequestHandler = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  let content
  switch (req.url) {
    case '/':
      content = readFileSync('index.html')
      break;
    case '/page-with-sse':
      content = readFileSync('page-with-sse.html')
      break;
  }
  if (!content) {
    res.writeHead(400)
    res.end()
    return
  }
  res.writeHead(200)
  res.end(content)
}

const server = createServer(requestListener)

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})