require('./bootstrap')
const wordList = require('./lib/words.json')
const allWordList = require('./lib/5-letter-words.json')


let currentRow = 1
let currentColumn = 1
let currentWord = null

const currentDate = new Date().toISOString().slice(0, 10)

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const params = {
    'maxRows': 6,
    'maxCols': 5
}

// window.localStorage.setItem('game')

const sleep = ms => new Promise(r => setTimeout(r, ms));

document.addEventListener('DOMContentLoaded', () => {

    wordList.forEach((word) => {
        if (currentDate == word.timestamp) {
            currentWord = word
        }
    })

    document.addEventListener('keydown', (event) => {
        validateInput(event);
    });
    
    document.querySelectorAll('#keyboard .key').forEach((key) => {
        key.addEventListener('click', (event) => {
            validateInput(event);
        });
    });
});


function validateInput(event){
    
    if (isValidKeypress(event) && boxIsEmpty()) {
        addLetterToColumn(event)
        return nextColumn()
    }

    if (isBackspace(event)) {
        return removeLetterFromColumn()
    }

    if (isSubmit(event)) {
        return validateRow()
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

function clearLetterBox() {
    return letterBox(currentColumn, currentRow).innerHTML = ''
}

function getInputWord()
{
    let currentInputWord = ''
    
    for (let column = 1; column <= params.maxCols; column++) {
        currentInputWord = currentInputWord + getLetterInPosition(currentRow, column).textContent
    }

    return String(currentInputWord)
}

async function inputWordIsReal()
{
    let currentInputWord = getInputWord();

    return allWordList.some(
        word => word.normalized == currentInputWord
    );

}

async function compareInputWithCurrentWord()
{

    const inputIsReal = await inputWordIsReal()

    if(inputIsReal){
        for (let column = 1; column <= params.maxCols; column++) {
            
            let letter = getLetterInPosition(currentRow, column).innerHTML
    
            console.log({
                'column': column,
                'letter': letter,
            })
    
            if (currentWord.normalized.charAt(column - 1) == getLetterInPosition(currentRow, column).textContent){
                // has the letter
                getLetterInPosition(currentRow, column).style.background = '#15803d' // green
                getLetterInPosition(currentRow, column).style.color = 'white'
            } else if (currentWord.normalized.indexOf(letter) != -1) {
                // has letter, but not on current colmn
                getLetterInPosition(currentRow, column).style.background = '#78350f' // brown
                getLetterInPosition(currentRow, column).style.color = 'white'
            } else {
                // doesnt have the letter
                getLetterInPosition(currentRow, column).style.background = '#1f2937' // gray
                getLetterInPosition(currentRow, column).style.color = 'white'
            }
    
            getLetterInPosition(currentRow, column).animate([
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], {
                duration: 150,
            });
    
            await sleep(350);
        }

        currentColumn = 1
        currentRow++
    }
    else{
        alert('Palavra não existe')
    }

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

