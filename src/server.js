const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/static', express.static(__dirname+'/assets/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/views/index.html')
})

const canvasWidth = 600
const canvasHeight = 600
const size = 60

let players = []
let coins = []

function createPlayer(socket){
    let player = {
        id: socket.id,
        x: Math.floor(Math.random()*10)*size,
        y: canvasHeight-size,
        nickname: 'thielf',
        score: 0
    }
    players.push(player)
}
function update(){
    io.emit('update', {players, coins})
}
function downCoins(){
    for(let i=0;i<coins.length;i++){
        coins[i].y += 10
    }
    update()
}
function createCoin(){
    let coin = {
        x: Math.floor(Math.random()*10)*size,
        y: -100
    }
    coins.push(coin)
    setInterval(downCoins, 3000)
}

io.on('connection', (socket) => {
    createPlayer(socket)
    socket.emit('start', {players, coins})
    socket.on('disconnect', () => {
        for(let i=0;i<players.length;i++){
            if(players[i].id == socket.id){
                players.splice(i, 1)
                update()
            }
        }
    })
    socket.on('move', (data) => {
        for(let i=0;i<players.length;i++){
            if(players[i].id == socket.id){
                createCoin()
                if(data.move == 'left'){
                    players[i].x -= 60
                }
                else if(data.move == 'right'){
                    players[i].x += 60
                }
                update()
                break
            }
        }
    })
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})