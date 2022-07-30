const container = document.querySelector('.grille');
const display = document.querySelector('h3');
let result = 0;
let allDiv;
let alienInvaders = [];
let shooterPosition = 229;
let direction = 1;

function creationGridAndAliens() {
    let indexAttr = 0;

    for(i = 0 ; i < 240 ; i++) {
        if(indexAttr === 0) {
            const bloc = document.createElement('div');
            bloc.setAttribute('data-left', 'true');
            container.appendChild(bloc);
            indexAttr++;
        } 
        else if(indexAttr === 19) {
            const bloc = document.createElement('div');
            bloc.setAttribute('data-right', 'true');
            container.appendChild(bloc);
            indexAttr = 0;
        } 
        else {
            const bloc = document.createElement('div');
            container.appendChild(bloc);
            indexAttr++;
        }
    }

    for(i = 1 ; i < 53 ; i++) {
        if(i === 13) {
            i = 21;
            alienInvaders.push(i);
        } else if (i === 33) {
            i = 41;
            alienInvaders.push(i);
        } else {
            alienInvaders.push(i);
        }
    }

    allDiv = document.querySelectorAll('.grille div');
    alienInvaders.forEach(invader => {
        allDiv[invader].classList.add('alien');
    })

    allDiv[shooterPosition].classList.add('shooter')
}

creationGridAndAliens();

function moveShooter(e) {
    allDiv[shooterPosition].classList.remove('shooter');

    if(e.keyCode === 37) {
        if(shooterPosition > 220) {
            shooterPosition -= 1;
        }
    }
    if(e.keyCode === 39) {
        if(shooterPosition < 239) {
            shooterPosition += 1;
        }
    }
    allDiv[shooterPosition].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

let downRight = true;
let downLeft = true;

function moveAliens() {

    for(let i = 0 ; i < alienInvaders.length ; i++) {
        if(allDiv[alienInvaders[i]].getAttribute('data-right') === 'true') {
            if(downRight) {
                direction = 20;
                setTimeout(() => {
                    downRight = false;
                }, 50);
            } else if(downRight === false) {
                direction = -1;
            }
            downLeft = true;
        } else if (allDiv[alienInvaders[i]].getAttribute('data-left') === 'true') {
            if(downLeft) {
                direction = 20;
                setTimeout(() => {
                    downLeft = false;
                }, 50)
            } else if(downLeft === false) {
                direction = 1;
            }
            downRight = true;
        }
    }

    for(let i = 0 ; i < alienInvaders.length ; i++) {
        allDiv[alienInvaders[i]].classList.remove('alien');
    }
    for(let i = 0 ; i < alienInvaders.length ; i++) {
        alienInvaders[i] += direction;
    }
    for(let i = 0 ; i < alienInvaders.length ; i++) {
        allDiv[alienInvaders[i]].classList.add('alien');
    }

    if(allDiv[shooterPosition].classList.contains('alien', 'shooter')) {
        display.textContent = 'Game Over';
        allDiv[shooterPosition].classList.add('boom');
        clearInterval(invaderId);
    }

    for(let i = 0 ; i < alienInvaders.length ; i++) {
        if(alienInvaders[i] > allDiv.length - 20) {
            display.textContent = 'Game Over';
            clearInterval(invaderId);
        }
    }
}

invaderId = setInterval(moveAliens, 500);

function shoot(e) {
    let laserId;
    let currentLaser = shooterPosition;

    function laserMove() {
        allDiv[currentLaser].classList.remove('laser');
        currentLaser -= 20;
        allDiv[currentLaser].classList.add('laser');

        if(allDiv[currentLaser].classList.contains('alien')) {
            allDiv[currentLaser].classList.remove('laser')
            allDiv[currentLaser].classList.remove('alien')
            allDiv[currentLaser].classList.add('boom')

            alienInvaders = alienInvaders.filter(element => element !== currentLaser)

            setTimeout(() => allDiv[currentLaser].classList.remove('boom'), 250)
            clearInterval(laserId);

            result++;
            if(result === 36) {
                display.textContent = 'Bravo !! C\'est gagné !!';
                clearInterval(invaderId);
            } else {
                display.textContent = `Score : ${result}`;
            }
        }

        if(currentLaser < 20) {
            clearInterval(laserId);
            setTimeout(() => {
                allDiv[currentLaser].classList.remove('laser'); 
            }, 100)
        }
    }

    if(e.keyCode === 32) {
        laserId = setInterval(() => {
            laserMove();
        }, 100)
    }
}

document.addEventListener('keyup', shoot);