var maxTowerNum = 5;
var towerNum = 0;
var towerTimer = null;
var gameStarted = false;
var gameTimer = null;
var gameSpeed = null;
var dead = false;
var landscapeScrolling = false;
var landscapeTimer = null;

function createTower () {
    var tower = document.createElement('img');
    tower.setAttribute("src", "trump-tower.png");
    tower.className = 'tower';
    tower.id = "tower" + towerNum;
    tower.style.padding = "0";
    tower.style.margin = "0";
    tower.style.position = "absolute";
    //console.log(document.getElementById('field').getBoundingClientRect().right);
    tower.style.left = 774 + (250 * towerNum) + "px";
    tower.style.height = "300px";
    tower.style.bottom = "0px";
    document.getElementById('field').appendChild(tower);
    towerNum++;
}

function move (itemClassName) {
    var items = document.getElementsByClassName(itemClassName);
    for (let i = 0; i < items.length; i++){
        //console.log(items[i].style.left);
        items[i].style.left = parseInt(items[i].style.left) - 1 + "px";
    }
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        if (towerTimer == null) {
            towerTimer = setInterval("move('tower')", 10);
        }
        //gameTimer = setInterval("gameSpeedUp()", 1000);
    }
}

function createBackdrop() {
    var newForest = document.createElement('img');
    newForest.setAttribute("src", "landscape.jpg");
    newForest.id = 'forestOne';
    newForest.className = 'forest';
    newForest.style.height = "100%";
    newForest.style.position = "absolute";
    newForest.style.top = "0px";
    newForest.style.left = "0px"

    document.getElementById('field').appendChild(newForest);
    if (landscapeTimer == null) {
        landscapeTimer = setInterval("move('forest')", 10);
    }
}

function die() {
    gameStarted = false;
}

function gameSpeedUp () {

}

function gameReset () {
    var field = document.getElementById('field');
    var plane = document.getElementById('plane');
    var forest = document.getElementById('forest');

    if(plane != undefined || plane != null) {
        document.body.removeChild(plane);
    }

    if(forest != undefined || forest != null) {
        document.body.removeChild(forest);
    }

    if(landscapeTimer != undefined || landscapeTimer != null) {
        clearInterval(landscapeTimer)
        landscapeTimer = null;
    }


    if(field != undefined || field != null) {
        document.body.removeChild(field);
    }



    var newField = document.createElement('div');
    newField.id = 'field';
    newField.style.height = "600px";
    newField.style.border = "solid black";
    newField.style.width = "100%";
    newField.style.position = "absolute"
    newField.style.minWidth = "400px";
    newField.style.top = "0px"
    newField.style.right = "0px"
    newField.style.overflow = "hidden";
    document.getElementById('container').appendChild(newField);



    var newPlane = document.createElement('img');
    newPlane.setAttribute("src", "bird.gif");
    newPlane.id = 'plane';
    newPlane.style.position = "absolute";
    newPlane.style.padding = "0";
    newPlane.style.margin = "0";
    newPlane.style.top = "250px";
    newPlane.style.left = "50px";
    newPlane.style.zIndex = "10";
    document.getElementById('field').appendChild(newPlane);

    for (let i = 0; i < maxTowerNum; i++) {
        createTower();
    }
}

function keyHandler(e) {
    var code = null;
    if (e.event) {
        code = e.event;
    } else if (e.which) {
        code = e.which;
    }
    if (code == 39) {
        return;
    }
    if (code == 32) {
        startGame();
    }
}

onload=function() {
    document.body.bgColor = "black";
    var gameContainer = document.createElement('div');
    gameContainer.id = "container";
    gameContainer.style.position = "relative";
    gameContainer.style.width = "700px";
    gameContainer.style.margin = "0 auto";
    gameContainer.style.padding = "0";
    document.body.appendChild(gameContainer);

    gameReset();

    onkeypress=keyHandler

}