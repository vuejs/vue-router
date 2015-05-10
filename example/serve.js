var exec = require('child_process').exec
var spawn = require('child_process').spawn
var app = require('express')()

app.get('/example.build.js', function (req, res) {
  res.sendFile(__dirname + '/example.build.js')
})

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000, function () {
  console.log('dev server running on localhost:3000\n')
  openURL('http://localhost:3000')
})

function openURL (url) {
  switch (process.platform) {
    case "darwin":
      exec('open ' + url)
      break
    case "win32":
      exec('start ' + url)
      break
    default:
      spawn('xdg-open', [url])
  }
}