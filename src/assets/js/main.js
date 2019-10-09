const socket = io()

let game = {
    canvas,
    players:undefined,
    coins:undefined,
    images: {
        coin: undefined
    },
    createGame: (data) => {
        game.canvas = document.querySelector('#canvas')
        game.canvas.width = 600
        game.canvas.height = 600
        game.ctx = game.canvas.getContext('2d')
        game.images.player = new Image()
        game.images.coin = new Image()
        game.update(data)
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 37){
                socket.emit('move', {move:'left'})
            }
            else if(e.keyCode == 39){
                socket.emit('move', {move:'right'})
            }
        })
        setInterval(game.render.render, 1000/30)
    },
    update: (data) => {
        game.players = data.players
        game.coins = data.coins
    },
    render: {
        render: () => {
            let render = game.render
            render.clearCanvas()
            render.renderPlayers()
            render.renderCoins()
            // requestAnimationFrame(render.render)
        },
        renderCoins: () => {
            for(let i=0;i<game.coins.length;i++){
                let ctx = game.ctx
                ctx.drawImage(game.images.coin, game.coins[i].x, game.coins[i].y, 60, 60)
                game.images.coin.src = 'static/img/coin.png'
            }
        },
        renderPlayer: (player, isLocalPlayer) => {
            let ctx = game.ctx
            ctx.beginPath()
            ctx.rect(player.x, player.y, 60, 60)
            if(isLocalPlayer){
                ctx.fillStyle = '#ff00ff66'
            }else{
                ctx.fillStyle = '#ffff0066'
            }
            ctx.fill()
        },
        renderPlayers: () => {
            for(let i=0;i<game.players.length;i++){
                if( game.players[i].id == socket.id ){
                    game.render.renderPlayer(game.players[i], true)
                }else{
                    game.render.renderPlayer(game.players[i], false)
                }
            }
        },
        clearCanvas: () => {
            let ctx = game.ctx
            ctx.beginPath()
            ctx.rect(0, 0, game.canvas.width, game.canvas.height)
            ctx.fillStyle = '#5555ff'
            ctx.fill()
        }
    }
}

socket.on('start', (data) => {
    game.createGame(data)
})

socket.on('update', (data) => {
    game.update(data)
})