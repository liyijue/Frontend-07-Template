const http = require('http')

http.createServer((request, resopnse) => {
  let body = []

  request.on('error', err => {
    console.error(err)
  }).on('data', chunk => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log('body:', body)
    resopnse.writeHead(200, { 'Content-Type': 'text/html' })
    resopnse.end(' Hello World\n')
  })
}).listen(8088)

console.log('service started')

