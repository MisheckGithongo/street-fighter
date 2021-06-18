const fs = require('fs')
const express = require('express')
const app = express()
var http = require('https').createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
},app)
const io = require('socket.io')(http)

let stream
let sampleNumber
let gestureType
let previousSampleNumber

// app.use('/', (req, res)=>res.send("Street Fighter"))

app.use('/record', express.static(__dirname + '/public/mobile/record/'))

process.argv.forEach(function (val, index, array) {
    gestureType = array[2]
    sampleNumber = parseInt(array[3])
    previousSampleNumber = sampleNumber
    stream = fs.createWriteStream(`data/sample_${gestureType}_${sampleNumber}.txt`, {flags:'a'})
})

io.on('connection', function(socket){
    socket.on('motion data', function(data){
        if(sampleNumber !== previousSampleNumber){
            stream = fs.createWriteStream(`./data/sample_${gestureType}_${sampleNumber}.txt`, {flags:'a'})
        }
        stream.write(`${data}\r\n`)
    })

    socket.on('end motion data', function(){
        stream.end()
        sampleNumber+=1
    })

    socket.on('connected', function(){
        console.log('front end connected')
    })
})


http.listen(process.env.PORT || 3000)