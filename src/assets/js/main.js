const socket = io()

let game = {
    canvas,
    players:undefined,
    coins:undefined,
    createGame: (data) => {
        game.canvas = document.querySelector('#canvas')
        game.canvas.width = 600
        game.canvas.height = 600
        game.ctx = game.canvas.getContext('2d')
        game.update(data)
        window.addEventListener('keyup', (e) => {
            if(e.keyCode == 37){
                socket.emit('move', {move:'left'})
            }
            else if(e.keyCode == 39){
                socket.emit('move', {move:'right'})
            }
        })
        setInterval(game.render.render, 1000/60)
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
            requestAnimationFrame(render.render)
        },
        renderCoins: () => {
            for(let i;i<game.coins.length;i++){
                console.log('x')
                let ctx = game.ctx
                ctx.beginPath()
                ctx.rect(game.coins[i].x, game.coins[i].y, 60, 60)
                ctx.fillStyle = "#fff"
                ctx.fill()
            }
        },
        renderPlayer: (player, isLocalPlayer) => {
            let ctx = game.ctx
            // let img = new Image()
            // img.onload = () => {
            //     ctx.drawImage(img, 10, 10)
            // }
            // if(isLocalPlayer){
            //     img.src = "static/img/player.png"
            // }else{
            //     img.src = "static/img/player_red.svg"
            // }
            // var img = new Image();
            // img.onload = function () {
            //     ctx.drawImage(img, player.x, player.y, 60, 60);
            // }
            // img.src = "static/img/player.svg";
            ctx.beginPath()
            ctx.rect(player.x, player.y, 60, 60)
            ctx.fillStyle = "#000"
            ctx.fill()
        },
        renderPlayers: () => {
            for(let i=0;i<game.players.length;i++){
                let isLocalPlayer = false
                if( game.players[i].id == socket.id ){
                    isLocalPlayer = true
                }
                game.render.renderPlayer(game.players[i], isLocalPlayer)
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