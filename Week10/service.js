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
          #container {
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(0,0,255);
          }
          #container #myid {
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
          }
          #container #c1 {
            flex: 1;
            background-color: rgb(0,255,0);
          }
        </style>
      </head>
      <body>
          <div id="container">
            <div id="myid"></div>
            <div id="c1"></div>
          </div>
      </body>
    </html>`)
  })
}).listen(8088)

console.log('service started')

