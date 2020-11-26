const STORE = {
    questions: [
     {
        question: 'What color is broccoli?',
        answers: ['red','orange','pink','green'],
        correctAnswer: 'green'
     },
     { 
        question: 'How many scolville Heat Units does Pepper-x the hottest pepper have?',
        answers: ['8,820,000 SHU','3,180,000 SHU','1,300,000 SHU','730,000 SHU'],
        correctAnswer: '3,180,000 SHU' 
     },
     { 
        question: 'Which one of these is NOT a major food group?',
        answers: ['Protein','Vegetables','Chocalate','Grains'],
        correctAnswer: 'Chocalate'
     },
     { 
        question: 'Which one of these is not an ingrediant in cake?',
        answers: ['Eggs','Beef','Flour','Milk'],
        correctAnswer: 'Beef'
     },
     { 
        question: 'Which one of these is tea NOT made of?',
        answers: ['Roots','Bark','Beans','Leaves',],
        correctAnswer: 'Beans'
     },
    ],
    quizStarted: false,
    currentQuestionNumber: 0,
    score: 0
};

/**
* Generates HTML for the start screen
*/
function generateStartScreenHtml() {
    return `
      <div class="start-screen">
        <p>This quiz will test your knowlege on food topics.</p>
        <button type="button" id="start">Start Quiz</button>
      </div>
    `;
}

/**
* Generates the HTML for the section of the app 
* that displays the question number and the score
*/
function generateQuestionNumberAndScoreHtml() {
    return `
    <ul class="question-and-score">
    <li id="question-number">
      Question Number: ${STORE.currentQuestionNumber + 1}/${STORE.questions.length}
      </li>
    <li id="score">
      Score: ${STORE.score}/${STORE.questions.length}
      </li>
  </ul>`
}

/**
* Generates the list of possible answers for
* one question
*/
function generateAnswersHtml() {
    const answersArray = STORE.questions[STORE.currentQuestionNumber].answers
    let answersHtml = '';
    let i = 0;
  
    answersArray.forEach(answer => {
      answersHtml += `
        <div id="option-container-${i}">
          <input type="radio" name="options" id="option${i + 1}" value= "${answer}" tabindex ="${i + 1}" required> 
          <label for="option${i + 1}"> ${answer}</label>
        </div>
      `;
      i++;
    });
    return answersHtml;
}

/**
* Generates the HTML to display one question
*/
function generateQuestionHtml() {
    let questionNumber = STORE.questions[STORE.currentQuestionNumber];
    return `
      <form id="question-form" class="question-form">
        <fieldset>
          <div class="question">
            <legend> ${questionNumber.question}</legend>
          </div>
          <div class="options">
            <div class="answers">
              ${generateAnswersHtml()}
            </div>
          </div>
          <button type="submit" id="submit-answer-btn" tabindex="5">Submit</button>
          <button type="button" id="next-question-btn" tabindex="6"> Next &gt;></button>
        </fieldset>
      </form >
    `;
  }
  
/**
* Generates the HTML for the results screen
*/
function generateResultsScreen() {
    return `
      <div class="results">
        <form id="js-restart-quiz">
          <fieldset>
            <div class="row">
              <div class="col-12">
                <legend>Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
              </div>
            </div>
          
            <div class="row">
              <div class="col-12">
                <button type="button" id="restart"> Restart Quiz </button>
              </div>
            </div>
          </fieldset>
      </form>
      </div>
    `;
}
  
  
function generateFeedbackHTML(answerStatus) {
    let correctAnswer = STORE.questions[STORE.currentQuestionNumber].correctAnswer;
    let html = '';
    if (answerStatus === 'correct') {
      html = `
      <div class="right-answer">That is correct!</div>
      `;
    }
    else if (answerStatus === 'incorrect') {
      html = `
        <div class="wrong-answer">That is incorrect. The correct answer is ${correctAnswer}.</div>
      `;
    }
    return html;
}
  
  
/*********************************************
------------ RENDER FUNCTION -------------
*/
  
function render() {
    let html ='';
    /* If quiz has not been started */
    if (STORE.quizStarted === false) {
        $('main').html(generateStartScreenHtml());
        return;
    }
    else if (STORE.currentQuestionNumber >= 0 && STORE.currentQuestionNumber < STORE.questions.length) {
        html = generateQuestionNumberAndScoreHtml();
        html += generateQuestionHtml();
        $('main').html(html);
    }
    else {
        $('main').html(generateResultsScreen());
    }
    console.log('render()')
}
  
/*------------ EVENT HANDLER FUNCTIONS -----------*/
  
/***************************************************************
------ When "Start" button clicked do etc.. & Rerender ------
*/
  
function onStart() {
    $('main').on('click', '#start', function (event) {
      STORE.quizStarted = true;
      render();
    });
}
  
/**************************************************************
------ When "Next" button clicked do etc.. & Rerender ------
*/
  
function onNextQuestionClick() {
    $('body').on('click', '#next-question-btn', (event) => {
      render();
    });
}
  
/*********************************************************************
------ When "Submit" button clicked do etc.. & Rerender ------
*/
  
function onSubmissionClick() {
    $('body').on('submit', '#question-form', function (event) {
        event.preventDefault(); /* prevent default submisison request */
        const questionNumber = STORE.questions[STORE.currentQuestionNumber];
    
        // get value from checked checkbox
        let selectedOption = $('input[name=options]:checked').val();
        /*
         * Creates an id '#option-container' + the index of 
         * the current question in the answers array.
         * Example: #option-container-0
         */
        let optionContainerId = `#option-container-${questionNumber.answers.findIndex(i => i === selectedOption)}`;
    
        if (selectedOption === questionNumber.correctAnswer) {
          STORE.score++;
          $(optionContainerId).append(generateFeedbackHTML('correct'));
        }
        else {
          $(optionContainerId).append(generateFeedbackHTML('incorrect'));
        }
        STORE.currentQuestionNumber++;
        // hide the submit button
        $('#submit-answer-btn').hide();
        // disable all inputs
        $('input[type=radio]').each(() => {
          $('input[type=radio]').attr('disabled', true);
        });
        // show the next button
        $('#next-question-btn').show();
    
    });
    console.log('onSubmissionClick()')
}
  
/***************************************************
------ When "Restart" button clicked ------
------ all STORE values will be reset -----
*/
  
function onRestartClick() {
    $('body').on('click', '#restart', () => {
        restartQuiz();
        render();
    });
    console.log('onRestartClick()')
}
  
function restartQuiz() {
    STORE.quizStarted = false;
    STORE.currentQuestionNumber = 0;
    STORE.score = 0;
}
  
/***********************************************/
  
function handleQuizApp() {
    render();
    onStart();
    onNextQuestionClick();
    onSubmissionClick();
    onRestartClick();
}
  
$(handleQuizApp);