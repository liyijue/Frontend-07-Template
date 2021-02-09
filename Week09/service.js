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
    resopnse.end(`<html maaa=a >
      <head>
        <style>
          body div #myid {
            width: 100px;
            background-color: #ff5000;
          }
          body div img {
            width: 30px;
            background-color: #ff1111;
          }
        </style>
      </head>
      <body>
          <div>
            <img id="myid" />
            <img />
          </div>
      </body>
    </html>`)
  })
}).listen(8088)

console.log('service started')

