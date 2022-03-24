require('./bootstrap')

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

const wordList = require('./lib/words.json')
const allWordList = require('./lib/5-letter-words.json')


let currentRow = 1
let currentColumn = 1
let currentWord = null
let gameWon = false

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

    let status = false

    document.addEventListener('keydown', async (event) => {
        if (!status) {
            status = true

            try {
                await validateInput(event);
            } finally {
                status = false
            }
        }
    });
    
    document.querySelectorAll('#keyboard .key').forEach((key) => {
        key.addEventListener('click', async (event) => {
            // await keyPress(event.target)
            await validateInput(event);
        });
    });
});

async function keyPress(key) {
    // return new Promise(resolve => key.onkeyup = () => resolve());
    return new Promise(resolve => key.onkeyup = resolve);
}

async function validateInput(event){
    
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
    console.log(letter)
    return document.querySelector(`#keyboard div[data-key='${ letter.toLowerCase() }']`)
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
                console.log(getKeyboardLetterElement(getLetterInPosition(currentRow, column).textContent))

            } else if (currentWord.normalized.indexOf(letter) != -1) {
                // has letter, but not on current colmn
                getLetterInPosition(currentRow, column).style.background = '#78350f' // brown
                getLetterInPosition(currentRow, column).style.color = 'white'
            } else {
                // doesnt have the letter
                getLetterInPosition(currentRow, column).style.background = '#1f2937' // gray
                getLetterInPosition(currentRow, column).style.color = 'white'
            }

            setWordWithAccents(inputIsReal[0])

            if (currentWord.normalized == getInputWord()){
                gameWon = true                
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
        
        let row = document.querySelector(`#row-${currentRow}`)

        row.animate([
            {   
                transform: 'translate3d(-1px, 0, 0)',
                cssOffset: 0.1
            },
            {
                transform: 'translate3d(2px, 0, 0)',
                cssOffset: 0.3
            },
            {
                transform: 'translate3d(-4px, 0, 0)',
                cssOffset: 0.8
            },
            {
                transform: 'translate3d(4px, 0, 0)',
                cssOffset: 1
            },
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

