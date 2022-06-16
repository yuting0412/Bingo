const socket = io('/');
let play = 0;
socket.on('playerCount', (count) => {
    // 接收到 server 的 playerCount 事件，更改
    // console.log("Now All Player Count", count.playerCount);
    document.getElementById('playerCount').innerHTML = count.playerCount;
});
socket.on('play',() => {
    if (play == 1){
        location.href = '/game';
    }
});
function addPlayer(){
    if (play == 0){
        //console.log("emit");
        socket.emit("add player");
        // 通知 Server "add player" 事件
        play += 1;
    }
}
function start(){
    socket.emit("start");
}