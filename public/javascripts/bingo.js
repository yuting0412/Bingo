var usedNums = new Array(76);
var check = new Array(25);
var startPlay = 0; // 是否開始遊戲
var allStart = 0; // 全部人都準備好了
var winwin = 0; // 是玩的人
var myID; // player ID
var canChoose = 0;
const socket = io('/');

socket.on('playerID', (ID) => { // 一開始 server 給 ID
  myID = ID.prepare;
  console.log(myID);
});

socket.on('can choose ID', (can) => { // server 通知現在誰能選
  if (myID == can.id){
    document.getElementById('yourTurn').style.display = "inline";
    canChoose = 1;
  }else{
    document.getElementById('yourTurn').style.display = "none";
  }
});

socket.on('wait', (waiting) => {
  document.getElementById('wait').innerHTML = "waiting for " + waiting.wait + " player";
});

socket.on('start',(can) => {
  allStart = 1;
  document.getElementById("wait").style.display = "none";
  if (myID == can.id){
    document.getElementById('yourTurn').style.display = "inline";
    canChoose = 1;
  }
});

socket.on('other choose',(arg) => {
  otherChooseNum(arg.num);
});

socket.on('other win', () => {
  if (winwin == 0){
    var popup_window = document.getElementById("window-loose");
    popup_window.style.display = "block";
  }
});

function getNewNum() {
  return Math.floor(Math.random() * 24);
}

function setSquare(thisSquare) { // 設定數字
  var currSquare = thisSquare;
  var newNum;
  do {
    newNum = getNewNum() + 1;
  }while (usedNums[newNum]);
  usedNums[newNum] = true;
  document.getElementById(currSquare).innerHTML = newNum;
}

function newCard() { // 產生新卡片
  //Starting loop through each square card
   for(let i = 0; i < 24; i++) {  //<--always this code for loops. change in red
     setSquare(i);
     document.getElementById(i).style.backgroundColor = "";
   }
   for (let i = 0; i < 25; i++){ // 設定 check 初始值
    check[i] = 0;
   }check[12] = 1;
}

function anotherCard() { // 換卡片
  for(var i = 1; i < usedNums.length; i++) {
    usedNums[i] = false;
  } newCard();
}

function start() { // 開始遊戲
  startPlay = 1;
  socket.emit("prepare");
  document.getElementById("changecard").style.display = "none";
  document.getElementById("start").style.display = "none";
}

function checkAns(){
  let countLine = 0;
  // 橫線
  for (let i = 0; i < 5; i++){
    let num = 0;
    for (let j = 0; j < 5; j++){
      if (check[i*5 + j] == 0){
          break;
      }num++;
      if(num == 5){
          countLine++;
      }
    }
  }
  // 直線
  for (let i = 0; i < 5; i++){
    let num = 0;
    for (let j = 0; j < 5; j++){
      if(check[i + j*5] == 0){
          break;
      }
      num++;
      if(num == 5){
          countLine++;
      }
    }
  }
  // 斜線
  let num = 0;
  for (let i = 0; i < 5; i++){
    if(check[6*i] == 0){
      break;
    }
    num++;
    if(num == 5){
      countLine++;
    }
  }
  num = 0;
  for (let i = 1; i < 6; i++){
    if(check[4*i] == 0){
      break;
    }num++;
    if(num == 5){
      countLine++;
    }
  }
  return countLine;
}

function selectNum(id) { // 選數字 (自己選的 &　依位置)
  if (startPlay == 1 && allStart == 1){
    if (canChoose == 1){
      document.getElementById(id).style.backgroundColor = "#FFC0CB";
      socket.emit('have choose',{myID:myID});
      canChoose = 0;
      // 回傳點擊的數字
      if (id < 12){
        check[id] = 1;
      }else{
        check[parseInt(id)+1] = 1;
      }
      socket.emit("choose num",{num : document.getElementById(id).textContent});
      if (checkAns() == 3){
        socket.emit("win");
        winwin = 1;
        bingo();
      }
    }
  }
}

function otherChooseNum(num){ // 別人選的，依數字
  for (let i = 0; i < 24; i++){
    if (document.getElementById(i).textContent == num){
      document.getElementById(i).style.backgroundColor = "#FFC0CB";
      if (i < 12){
        check[i] = 1;
      }else{
        check[i+1] = 1;
      }
    }
  }
  if (checkAns() == 3){
    winwin = 1;
    socket.emit("win");
    bingo();
  }
}



