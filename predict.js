const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')
const fs = require('fs')

const express = require('express')
const app = express()
var http = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  },app)
const io = require('socket.io')(http)

let liveData = []
let predictionDone = false

let model
const gestureClasses = ['hadoken', 'punch', 'uppercut']

app.use('/', express.static(__dirname + '/public/desktop'))
app.use('/predict', express.static(__dirname + '/public/mobile'))

io.on('connection', async function(socket){
    model = await tf.loadLayersModel('file://model/model.json')
    socket.on('motion data', function(data){
        predictionDone = false
        if(liveData.length < 300){
            liveData.push(data.xAcc, data.yAcc, data.zAcc, data.xGyro, data.yGyro, data.zGyro)
        }
    })

    socket.on('end motion data', function(){
        if(!predictionDone && liveData.length){
            predictionDone = true
            console.log(liveData.length)
            predict(model, liveData)
            liveData = []
        }
    })

    socket.on('connected', function(){
        console.log('front end connected')
    })
})

const predict = (model, newSampleData) => {
    tf.tidy(() => {
        const inputData = newSampleData
        const input = tf.tensor2d([inputData], [1, 300])
        const predictOut = model.predict(input)
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]]

        console.log(winner)
        
        switch(winner){
            case 'punch':
                io.emit('gesture', 'punch')
                break
            case 'hadoken':
                io.emit('gesture', 'hadoken')
                break
            case 'uppercut':
                io.emit('gesture', 'uppercut')
                break
            default:
                break
        }
    })
}

http.listen(process.env.PORT || 4000)