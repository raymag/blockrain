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
const coinRate = 1

let players = []
let coins = []

function isHitting(player){
    for(let i=0;i<coins.length;i++){
        if(player.x >= coins[i].x 
            && player.x <= coins[i].x + 60 
            && player.y - 120 <= coins[i].y){
                player.score++
                coins.splice(i, 1)
            }
        }
}
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
        coins[i].y += 3
        if(coins[i].y >= canvasHeight){
            coins.splice(i,1)
        }
    }
    update()
    if( Math.floor(Math.random()*100) <= coinRate ){
        createCoin()
    }
}
function createCoin(){
    let coin = {
        x: Math.floor(Math.random()*10)*size,
        y: -100
    }
    coins.push(coin)
}

setInterval(downCoins, 1000/30)

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
                isHitting(players[i])
                if(data.move == 'left'){
                    players[i].x -= 5
                }
                else if(data.move == 'right'){
                    players[i].x += 5
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