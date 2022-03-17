require('./bootstrap')

let currentRow = 1
let currentColumn = 1

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const params = {
    'maxRows': 6,
    'maxCols': 5
}

const currentWord = 'carol'

document.addEventListener("DOMContentLoaded", function (event) {
    
    document.addEventListener('keydown', (event) => {
        validateInput(event);
    });
    
    document.querySelectorAll('#keyboard .key').forEach((key) => {
        key.addEventListener('click', (event) => {
            console.log(event.target.textContent.trim())
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
        { transform: 'scale(1.15)' },
        { transform: 'scale(1)' }
    ], {
        duration: 120,
    });

    event.type == "click" 
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
    return document.querySelector(`.board-row div[data-column="${ currentColumn }"][data-row="${ currentRow }"]`)
}

function getLetterInPosition(row, col){
    return document.querySelector(`.board-row div[data-column="${col}"][data-row="${row}"]`)
}

function clearLetterBox() {
    return letterBox(currentColumn, currentRow).innerHTML = ""
}

function compareInputWithCurrentWord()
{

    for (let column = 1; column <= params.maxCols; column++) {
        
        let letter = getLetterInPosition(currentRow, column).innerHTML

        console.log({
            'column': column,
            'letter': letter,
            'indexof': currentWord.indexOf(letter)
        })

        if (currentWord.indexOf(letter) == column - 1){
            getLetterInPosition(currentRow, column).style.background = '#15803d'
        }else if (currentWord.indexOf(letter) != -1){
            getLetterInPosition(currentRow, column).style.background = '#78350f'
        }else{
            getLetterInPosition(currentRow, column).style.background = '#1f2937'
        }
    }


}

function validateRow() {
    if(currentColumn == params.maxCols && !boxIsEmpty()){
        compareInputWithCurrentWord()

        currentColumn = 1
        currentRow++
        
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

