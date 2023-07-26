/* Lo que se hizo
1° Para hacer el scroll en el contenedor options se modifica una variable css que forma parte de la propiedad transform cada vez que se le da
click a un botón */

// Get DOM elements
const templateFirstSection = document.querySelector('#section-one');
const templateSecondSection = document.querySelector('#section-two');
const templateThirdSection = document.querySelector('#section-three');
const templateTimer = document.querySelector('#timer');
const templateOption = document.querySelector('#option-architecture');
const gameCointainer = document.querySelector('.game-container');
// Get the root element
let root = document.querySelector(':root');

// LOCAL STORAGE
let bestScoreTimes = ['---','---','---','---'];
if (!localStorage.getItem('scores')){
    // Local Storage
    localStorage.setItem('scores', JSON.stringify(bestScoreTimes)); 
    
    console.log(bestScoreTimes, 'creación local storage');
    
} else if(localStorage.getItem('scores')){
    // Get scores from localStorage
    bestScoreTimes = JSON.parse(localStorage.getItem('scores'));
}


// First Section ------------------------------------------------------------------------------------------------------------------------------
let userChoice_AmountOfQuestions = '';
let userChoice_index = '';


function renderFirstSection(){
    // Clean gameContainer
    gameCointainer.innerHTML = '';
    const templateFirstSectionCopy = templateFirstSection.cloneNode(true).content;
    const questionsAmountOptions = templateFirstSectionCopy.querySelector('.options-container').children;
    const startRoundButton = templateFirstSectionCopy.querySelector('#start-round-button');

    // EVENTS
    // Ciclo para recorrer los elementos del DOM (options) y asignarles un evento único
    for (let i = 0; i < questionsAmountOptions.length; i++) {
        const option = questionsAmountOptions[i];
        // Asignar valor desde el local storage a cada math option
        option.querySelector('.score').textContent = bestScoreTimes[i];

        option.addEventListener('click', () => {

            // Ciclo para volver a recorrer los elementos del DOM (options) y quitarles el background en caso de que ya se les halla dado click
            for (let i = 0; i < questionsAmountOptions.length; i++) {
                const option = questionsAmountOptions[i];
                let optionTitle = option.querySelector('.option-title').innerHTML;

                if(optionTitle === userChoice_AmountOfQuestions){
                    option.style.removeProperty('background-color');
                    break;
                }
            }

            // Cambiarles el color background al click
            userChoice_AmountOfQuestions = option.querySelector('.option-title').innerHTML;
            option.setAttribute('style', 'background-color: #8acaff');
            // Actualizar el index de la opción a la que se le dió click
            userChoice_index = i;
            console.log(userChoice_index);
        });
    }

    startRoundButton.addEventListener('click', () => {
        if(userChoice_AmountOfQuestions === ''){
            alert('Elige una opción');
        } else{
            renderTimer();
        }
    });

    gameCointainer.append(templateFirstSectionCopy);
}
renderFirstSection();

// Render Timer ------------------------------------------------------------------------------------------------------------------------------
function renderTimer(){
    // Clean gameContainer
    gameCointainer.innerHTML = '';
    const templateTimerCopy = templateTimer.cloneNode(true).content;

    // DOM elements
    const timerNumber = templateTimerCopy.querySelector('.timer-count');
    setTimeout(() => {
        timerNumber.textContent = '2';
    }, 1000);
    setTimeout(() => {
        timerNumber.textContent = '1';
    }, 2000);
    setTimeout(() => {
        timerNumber.textContent = 'GO!';
    }, 3000);
    setTimeout(() => {
        renderSecondSection();
    }, 4000);
    gameCointainer.append(templateTimerCopy);
}

// Second Section ------------------------------------------------------------------------------------------------------------------------------

let pointsCounter = 0;
function renderSecondSection(){
    // Clean gameContainer
    gameCointainer.innerHTML = '';
    pointsCounter = 0;
    const templateSecondSectionCopy = templateSecondSection.cloneNode(true).content;
    
    // Getting DOM elements
    const pointsGotten = templateSecondSectionCopy.querySelector('.game-title-container .title');
    const footer = templateSecondSectionCopy.querySelector('.footer');

    // True/False array
    const operationAnswers = [];
    pointsGotten.textContent = `POINTS: ${pointsCounter}`;
    
    renderOptions_IncludeMathLogic(templateSecondSectionCopy, operationAnswers);
    startChronometer();
    // Get Math options that had been rendered to put a background color when selected
    const allMathOptions = templateSecondSectionCopy.querySelector('.traslate-options').children;
    allMathOptions[0].style.backgroundColor = '#8acaff';

    // EVENTS
    templateSecondSectionCopy.querySelector('.wrong-button').addEventListener('click', scrollOptionsContainer);
    templateSecondSectionCopy.querySelector('.right-button').addEventListener('click', scrollOptionsContainer);
    templateSecondSectionCopy.querySelector('.wrong-button').addEventListener('click', checkWrongAnswer.bind(null, operationAnswers, pointsGotten, footer));
    templateSecondSectionCopy.querySelector('.right-button').addEventListener('click', checkRightAnswer.bind(null, operationAnswers, pointsGotten, footer));
    templateSecondSectionCopy.querySelector('.wrong-button').addEventListener('click', createBackgroundColorWhenSelected.bind(null, allMathOptions));
    templateSecondSectionCopy.querySelector('.right-button').addEventListener('click', createBackgroundColorWhenSelected.bind(null, allMathOptions));

    gameCointainer.append(templateSecondSectionCopy);
    // console.log(templateSecondSectionCopy);
}

let indexCounter_operationAnswers = -1;
function createBackgroundColorWhenSelected(allMathOptions){
    // Clean first math option background
    allMathOptions[0].style.backgroundColor = null;

    // If the math option exists in the array
    if(allMathOptions[indexCounter_operationAnswers + 1]){
        allMathOptions[indexCounter_operationAnswers + 1].style.backgroundColor = '#8acaff';
    }
    if(indexCounter_operationAnswers > 0){
        allMathOptions[indexCounter_operationAnswers].style.backgroundColor = null;
    } 
}

function renderNextSectionButton(footer){
    footer.innerHTML = '<button>Next Section</button>';
    footer.querySelector('button').addEventListener('click', renderThirdSection);
    footer.querySelector('button').addEventListener('click', stopChronometer);
    footer.querySelector('button').addEventListener('click', resetImportantVariables);
}

function checkRightAnswer(operationAnswers, pointsGotten, footer){
    if(operationAnswers[indexCounter_operationAnswers]){        
        pointsGotten.textContent = `POINTS: ${++pointsCounter}`;
    }
    if(indexCounter_operationAnswers === operationAnswers.length - 1){
        renderNextSectionButton(footer);
    }
}

function checkWrongAnswer(operationAnswers, pointsGotten, footer){
    if(operationAnswers[indexCounter_operationAnswers] === false){
        pointsGotten.textContent = `POINTS: ${++pointsCounter}`;
    } 
    if(indexCounter_operationAnswers === operationAnswers.length - 1){
        renderNextSectionButton(footer);
    }
}

function scrollOptionsContainer(){
    indexCounter_operationAnswers++;

    // GETTING CSS VARIABLES ---------------------------------------
    // Get the styles (properties and values) for the root
    const rootStyles = getComputedStyle(root);
    // Get a specific variable
    const cssVariable = rootStyles.getPropertyValue('--scroll-container-position-y');

    // Set the value of variable --blue to another value (in this case "lightblue")
    root.style.setProperty('--scroll-container-position-y', `calc(${cssVariable} - var(--scroll-option-position-y))`);
}

function resetImportantVariables(){
    // Reset userChoice SECTION ONE
    userChoice_AmountOfQuestions = '';

    // Reset indexCounter SECTION TWO
    indexCounter_operationAnswers = -1;

    // GETTING CSS VARIABLES ---------------------------------------
    root.style.setProperty('--scroll-container-position-y', `calc((var(--options-container-height) / 2) - (var(--scroll-option-position-y) / 2))`);
}


function createRandomMultiplication(mathOperation, operationAnswers){
    // Number between 0 and 1 to see if we are gonna create a right or wrong operacion
    const confirmCorrectOrIncorrectOperation = Math.floor(Math.random() * 2);
  
    const firstNumber = Math.floor(Math.random() * 13); //From 0 to 12
    const secondNumber = Math.floor(Math.random() * 13); //From 0 to 12
    if(confirmCorrectOrIncorrectOperation === 0){
        result = firstNumber * Math.floor(Math.random() * 13);
        if((firstNumber * secondNumber) === result) result += 1;
        operationAnswers.push(false);
    } else{
        result = firstNumber * secondNumber;
        operationAnswers.push(true);
    }
    mathOperation.textContent = `${firstNumber} X ${secondNumber} = ${result}`;
}

function renderOptions_IncludeMathLogic(templateSecondSection, operationAnswers){
    const optionsContainer = templateSecondSection.querySelector('.traslate-options');
    const amountOfQuestions = parseInt(userChoice_AmountOfQuestions.slice(0,2));

    // Cicle to see how many math operations are going to be created
    for (let i = 0; i < amountOfQuestions; i++) {
        const templateOptionCopy = templateOption.cloneNode(true).content;
        let mathOperation = templateOptionCopy.querySelector('.option-title');

        createRandomMultiplication(mathOperation, operationAnswers);
        optionsContainer.append(templateOptionCopy);
    }
    console.log(operationAnswers);
}


// Third Section ------------------------------------------------------------------------------------------------------------------------------

function renderThirdSection(){
    // Clean gameContainer
    gameCointainer.innerHTML = '';
    const templateThirdSectionCopy = templateThirdSection.cloneNode(true).content;
    
    const chronometerMinute_Second = chronometerOutput.slice(4,8).split(':').join(':') + 's';
    // Getting DOM elements
    templateThirdSectionCopy.querySelector('.score-time').textContent = chronometerMinute_Second;
    templateThirdSectionCopy.querySelector('.footer button').addEventListener('click', renderFirstSection);
    const bestTime = templateThirdSectionCopy.querySelector('.best-time');
    const pointsGotten = templateThirdSectionCopy.querySelector('.points-gotten');

    pointsGotten.textContent = `Point Gotten: ${pointsCounter}`;

    // Save score in LOCAL STORAGE
    // Primero compara los minutos y luego los segundos
    if(parseInt(chronometerMinute_Second.slice(0,1)) < parseInt(bestScoreTimes[userChoice_index].slice(0,1))){
        updateLocalStorage(bestTime, chronometerMinute_Second);

    } else if(parseInt(chronometerMinute_Second.slice(2,4)) < parseInt(bestScoreTimes[userChoice_index].slice(2,4))){
        updateLocalStorage(bestTime, chronometerMinute_Second);

    } else if(bestScoreTimes[userChoice_index] === '---'){
        // If the value hasn't been set
        updateLocalStorage(bestTime, chronometerMinute_Second);
    }

    // If no record has been broken
    const scoresFromLocalStorage = JSON.parse(localStorage.getItem('scores'))
    bestTime.textContent = `Best Time: ${scoresFromLocalStorage[userChoice_index]}`;
    
    gameCointainer.append(templateThirdSectionCopy);
}

function updateLocalStorage(bestTime, chronometerMinute_Second){
    bestScoreTimes[userChoice_index] = chronometerMinute_Second;
    localStorage.setItem('scores', JSON.stringify(bestScoreTimes)); 
    bestTime.textContent = `Best Time: ${chronometerMinute_Second}`;
}


// Chronometer ------------------------------------------------------------------------------------------------------------------------------
let myInterval;
let chronometerOutput = ``;
function startChronometer(){
    let chronometer = 0;
    
    let secondsOutput;
    let minutesOutput;
    let hoursOutput;
    
    myInterval = setInterval(() => {
        ++chronometer;
        const seconds = chronometer % 60;
        let minutes = Math.floor((chronometer / 60) % 60);
        let hours = Math.floor((chronometer / 3600) % 60);
        if(seconds < 10){
            secondsOutput = `0${seconds}`;
        } else{
            secondsOutput = `${seconds}`;
        }
        if(minutes < 10){
            minutesOutput = `0${minutes}`;
        } else{
            minutesOutput = `${minutes}`;
        }
        if(hours < 10){
            hoursOutput = `0${hours}`;
        } else{
            hoursOutput = `${hours}`;
        }
        chronometerOutput = `${hoursOutput}:${minutesOutput}:${secondsOutput}`;
        console.log(chronometer);
    }, 1000);
}

function stopChronometer(){
    clearInterval(myInterval);
}
