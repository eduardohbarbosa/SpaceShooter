const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

//Movimentação e Tiro
function flyShip(event){
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    }else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    }else if(event.key === ' '){
        event.preventDefault();
        fireLaser();
    }
}

//Subir
function moveUp(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '0px'){
        return;
    }else{
        let position = parseInt(topPosition);
        position -= 10;
        yourShip.style.top = `${position}px`
    }
}

//Descer
function moveDown(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '510px'){
        return;
    }else{
        let position = parseInt(topPosition);
        position += 10;
        yourShip.style.top = `${position}px`
    }
}

//Função de Tiro
function fireLaser(){
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement(){
    let xPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser){
    let laserInterval =  setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if(checkLaserColision(laser, alien)){
                alien.src = 'img/explosion.png';
                alien.classList.remove('.alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition === 340){
            laser.remove();
        }else{
            laser.style.left = `${xPosition + 8}px`
        }
    },10)
}

//Cria Inimigos
function createAliens(){
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//Move Inimigos
function moveAlien(alien){
    let moveAlienInterval = setInterval(()=> {
        let xPosition = parseInt(getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50){
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            }else{
                gameOver();
            }
        }else{
            alien.style.left = `${xPosition - 2}px`;
        }
    }, 30)
}

//Colisão
function checkLaserColision(laser,alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }

}

startButton.addEventListener('click', (event) => {
    playGame();
})

//Inicio do Jogo
function playGame(){
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//GameOver
function gameOver(){
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() =>{
        alert('Game Over');
        yourShip.style.top = "250px"
        startButton.style.display = 'block';
        instructionsText.style.display = 'block';

    })
}