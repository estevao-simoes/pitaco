require('./bootstrap')

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

const wordList = require('./lib/words.json')
const allWordList = require('./lib/5-letter-words.json')


let currentRow = 1
let currentColumn = 1
let currentWord = null
let gameState = {}

const currentDate = new Date().toISOString().slice(0, 10)

let date = new Date(currentDate)
let timerEnd = date.setDate(date.getDate() + 1)


const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const params = {
    'maxRows': 6,
    'maxCols': 5
}

if (localStorage.getItem('pitaco') === null) {
    setInitialGameState()
} else {
    getCurrentGameState()
}

if (currentDate != gameState.state.curDate){
    gameState.state = {
        "curDate": currentDate,
        "tries": [], //array of arrays
        "invalids": [],
        "curRow": 0,
        "curTry": [],
        "gameOver": false,
        "won": false
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

document.addEventListener('DOMContentLoaded', () => {

    showCountdownToNextWord()

    wordList.forEach((word) => {
        if (currentDate == word.timestamp) {
            currentWord = word
        }
    })

    updateBoardBasedOnState()

    // debounce
    let status = false
    
    document.addEventListener('keydown', async (event) => {
        if (!status) {
            status = true
            
            try {
                await validateInput(event).then(() => {
                    gameState.state.curTry = getInputWord()
                    setGameState(gameState)
                });
            } finally {
                status = false
            }
        }
    })
    
    document.querySelectorAll('#keyboard .key').forEach((key) => {
        key.addEventListener('click', async (event) => {
            // await keyPress(event.target)
            await validateInput(event).then(() => {
                gameState.state.curTry = getInputWord()
                setGameState(gameState)
            });
        });
    });

});


async function validateInput(event){

    if(gameState.state.won || gameState.state.gameOver) return
    
    if (isValidKeypress(event) && boxIsEmpty()) {
        addLetterToColumn(event)
        return nextColumn()
    }

    if (isBackspace(event)) {
        return removeLetterFromColumn()
    }

    if (isSubmit(event)) {
        return await validateRow()
    }
}

function addLetterToColumn(event){
    
    letterBox().animate([
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' }
    ], {
        duration: 120,
    });

    event.type == 'click' 
        ? letterBox().innerHTML = event.target.textContent.trim().toLowerCase()
        : letterBox().innerHTML = event.key
}

function removeLetterFromColumn(){
    
    if(isFirstColumn() && boxIsEmpty()) return 

    if(isLastColumn() && !boxIsEmpty()){
        return clearLetterBox()
    }

    currentColumn--
    return clearLetterBox()

}

function nextColumn() {
    if(currentColumn < params.maxCols){
        return currentColumn++
    }
}

function isFirstColumn() {
    return currentColumn == 1
}

function isLastColumn() {
    return currentColumn == params.maxCols
}

function boxIsEmpty() {
    return letterBox(currentColumn, currentRow).innerHTML.trim().length == 0
}

function letterBox() {
    return document.querySelector(`.board-row div[data-column='${ currentColumn }'][data-row='${ currentRow }']`)
}

function getLetterInPosition(row, col){
    return document.querySelector(`.board-row div[data-column='${col}'][data-row='${row}']`)
}

function getKeyboardLetterElement(letter){
    return document.querySelector(`#keyboard div[data-key='${ letter.toUpperCase() }']`)
}

function clearLetterBox() {
    return letterBox(currentColumn, currentRow).innerHTML = ''
}

function getInputWord()
{
    let currentInputWord = ''
    
    for (let column = 1; column <= params.maxCols; column++) {
        currentInputWord = currentInputWord + getLetterInPosition(currentRow, column).textContent
    }

    return String(currentInputWord).trim()
}

function inputWordIsReal()
{
    
    let currentInputWord = getInputWord()

    return allWordList.filter(
        word => word.normalized == currentInputWord
    )

}

async function setWordWithAccents(word)
{
    
    for (let column = 1; column <= params.maxCols; column++) {
        getLetterInPosition(currentRow, column).textContent = word.word.charAt(column - 1)
    }

}

async function compareInputWithCurrentWord()
{

    const inputIsReal = inputWordIsReal()

    if(inputIsReal.length){

        for (let column = 1; column <= params.maxCols; column++) {
            
            let letter = getLetterInPosition(currentRow, column).innerHTML

            if (currentWord.normalized.charAt(column - 1) == getLetterInPosition(currentRow, column).textContent){
                // has the letter
                getLetterInPosition(currentRow, column).style.background = '#15803d' // green
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(letter).style.background = '#15803d'

            } else if (currentWord.normalized.indexOf(letter) != -1) {
                // has letter, but not on current colmn
                getLetterInPosition(currentRow, column).style.background = '#78350f' // brown
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(letter).style.background = '#78350f'

            } else {
                // doesnt have the letter
                getLetterInPosition(currentRow, column).style.background = '#1f2937' // gray
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(letter).style.background = '#1f2937'
                getKeyboardLetterElement(letter).style.opacity = '0.15'

            }
    
            getLetterInPosition(currentRow, column).animate([
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], {
                duration: 150,
            });
    
            await sleep(350);
        }

        
        
        gameState.state.curRow = currentRow
        gameState.state.curTry = getInputWord()
        gameState.state.tries.push(getInputWord())

        if (currentWord.normalized == getInputWord()) {
            gameState.state.won = true
            gameState.state.gameOver = true
            sendGameToServer()
        }

        if(currentRow == params.maxRows){
            gameState.state.won = false
            gameState.state.gameOver = true
            sendGameToServer()
        }

        setWordWithAccents(inputIsReal[0])

        currentColumn = 1
        currentRow++

    } else {
        
        let row = document.querySelector(`#row-${currentRow}`)

        gameState.state.invalids.push(getInputWord())

        row.animate([
            { transform: 'translate3d(-1px, 0, 0)' },
            { transform: 'translate3d(2px, 0, 0)' },
            { transform: 'translate3d(-4px, 0, 0)' },
            { transform: 'translate3d(4px, 0, 0)' },
        ], {
            duration: 120,
        });

        let tooltip = tippy(row, {
            content: 'A palavra não existe',
            theme: 'light',
        })

        tooltip.show()
        
        await sleep(800);

        tooltip.disable()
        
    }

    setGameState(gameState)

}

async function validateRow() {
    if(currentColumn == params.maxCols && !boxIsEmpty()){
        await compareInputWithCurrentWord()
    }
}

function isValidKeypress(event){
    return letters.indexOf(event.key) >= 0 
        || letters.indexOf(event.target.textContent.trim().toLowerCase()) >= 0
}

function isBackspace(event){
    return event.code == 'Backspace' 
        || event.target.textContent.trim() == ''
}

function isSubmit(event){
    return event.code == 'Enter' 
        || event.target.textContent.trim() == 'ENTER'
}

// Storage Functions

function setGameState(gameState)
{
    return localStorage.setItem('pitaco', JSON.stringify(gameState))
}

function getCurrentGameState()
{
    gameState = JSON.parse(localStorage.getItem('pitaco'))

    return gameState
}

function setInitialGameState()
{
    gameState = {
        // "config": { "highContrast": 0, "hardMode": 0 },
        // "meta": { "startTime": 1, "endTime": 2, "highContrastChange": 0 },
        "stats": {
            "games": 0,
            "wins": 0,
            "curstreak": 0,
            "avgtime": 0,
            "mintime": 0,
            "maxtime": 0,
            "maxstreak": 0,
            "history": [
                0,
                0,
                0,
                0,
                0,
                0
            ]
        },
        "state": {
            "curDate": currentDate,
            "tries": [], //array of arrays
            "invalids": [],
            "curRow": 0,
            "curTry": [],
            "gameOver": false,
            "won": false
        }
    }

    return setGameState(gameState)
}

function updateBoardBasedOnState()
{
    gameState.state.tries.forEach( (word) => {
        for (let column = 1; column <= params.maxCols; column++) {

            getLetterInPosition(currentRow, column).innerHTML = word.charAt(column - 1)

            if (currentWord.normalized.charAt(column - 1) == word.charAt(column - 1)) {
                // has the letter
                getLetterInPosition(currentRow, column).style.background = '#15803d' // green
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(word.charAt(column - 1)).style.background = '#15803d'

            } else if (currentWord.normalized.indexOf(word.charAt(column - 1)) != -1) {
                // has letter, but not on current colmn
                getLetterInPosition(currentRow, column).style.background = '#78350f' // brown
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(word.charAt(column - 1)).style.background = '#78350f'

            } else {
                // doesnt have the letter
                getLetterInPosition(currentRow, column).style.background = '#1f2937' // gray
                getLetterInPosition(currentRow, column).style.color = 'white'
                getKeyboardLetterElement(word.charAt(column - 1)).style.background = '#1f2937'
                getKeyboardLetterElement(word.charAt(column - 1)).style.opacity = '0.15'

            }

        }
        
        setWordWithAccents(inputWordIsReal()[0])
        currentRow ++
    })
}

function showCountdownToNextWord()
{
    setInterval(showRemaining, 1000);
}

function showRemaining() {
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;

    let now = new Date();
    let distance = timerEnd - now;

    if (distance < 0) {
        location.reload();
    }

    let hours = Math.floor((distance % _day) / _hour);
    let minutes = Math.floor((distance % _hour) / _minute);
    let seconds = Math.floor((distance % _minute) / _second);

    document.getElementById('countdown').innerHTML = hours + 'H ';
    document.getElementById('countdown').innerHTML += minutes + 'M ';
    document.getElementById('countdown').innerHTML += seconds + 'S ';
}

async function sendGameToServer()
{
    window.axios.post('/api/game', {
        state: JSON.stringify(gameState.state)
    })
}
