// 안동 영종 단어와 퀴즈 어플

// DOM 요소들
const batchWordsInput = document.getElementById('batch-words');
const addBatchWordsBtn = document.getElementById('add-batch-words');
const manualWordInput = document.getElementById('manual-word');
const manualMeaningInput = document.getElementById('manual-meaning');
const addManualWordBtn = document.getElementById('add-manual-word');
const searchInput = document.getElementById('search-word'); // 단어 검색 입력창 추가
const wordListTable = document.getElementById('word-list').querySelector('tbody');
const wordCountSpan = document.getElementById('word-count');
const startQuizBtn = document.getElementById('start-quiz');
const vocabularySection = document.getElementById('vocabulary-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const quizDifficulty = document.getElementById('quiz-difficulty'); // 난이도 선택 추가
const quizProgressBar = document.getElementById('quiz-progress-bar'); // 진행률 바 추가
const notification = document.getElementById('notification');

// 퀴즈 관련 요소들
const questionNumberSpan = document.getElementById('question-number');
const scoreDisplaySpan = document.getElementById('score-display');
const timerElement = document.getElementById('timer');
const quizWordElement = document.getElementById('quiz-word');
const optionsContainer = document.getElementById('options-container');
const answerFeedback = document.getElementById('answer-feedback');
const finalScoreElement = document.getElementById('final-score');
const resultMessageElement = document.getElementById('result-message');
const wrongAnswersList = document.getElementById('wrong-answers-list');
const reviewWrongAnswersBtn = document.getElementById('review-wrong-answers');
const returnToVocabularyBtn = document.getElementById('return-to-vocabulary');

let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 6;
let wrongAnswers = [];
let isReviewMode = false;

function init() {
    updateWordList();
    addEventListeners();
}

function addEventListeners() {
    addBatchWordsBtn.addEventListener('click', addBatchWords);
    addManualWordBtn.addEventListener('click', addManualWord);
    startQuizBtn.addEventListener('click', startQuiz);
    reviewWrongAnswersBtn.addEventListener('click', startWrongAnswersReview);
    returnToVocabularyBtn.addEventListener('click', returnToVocabulary);
    searchInput.addEventListener('input', updateWordList); // 단어 검색 기능 추가
}

// ✅ 단어 검색 기능
function updateWordList() {
    const searchTerm = searchInput.value.toLowerCase();
    wordListTable.innerHTML = '';

    const filteredWords = vocabulary.filter(item => item.word.toLowerCase().includes(searchTerm));

    filteredWords.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.word}</td>
            <td>${item.meaning}</td>
            <td>
                <button onclick="deleteWord('${item.word}')">삭제</button>
            </td>
        `;
        wordListTable.appendChild(row);
    });

    wordCountSpan.textContent = `(${filteredWords.length}개)`;
    startQuizBtn.disabled = filteredWords.length < 4;
}

// ✅ 난이도 조절 기능
function startQuiz() {
    if (vocabulary.length < 4) {
        showNotification('퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.', true);
        return;
    }

    isReviewMode = false;
    const difficulty = quizDifficulty.value;
    const numQuestions = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;

    quizQuestions = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, numQuestions);

    vocabularySection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    resultSection.classList.add('hidden');

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    updateScoreDisplay();

    showQuestion(0);
}

// ✅ 퀴즈 진행률 바 업데이트
function updateProgressBar(current, total) {
    const progress = (current / total) * 100;
    quizProgressBar.style.width = `${progress}%`;
}

// ✅ 퀴즈 문제 표시 (진행률 업데이트 포함)
function showQuestion(index) {
    if (index >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const question = quizQuestions[index];
    questionNumberSpan.textContent = `문제 ${index + 1}/${quizQuestions.length}`;
    quizWordElement.textContent = question.word;

    optionsContainer.innerHTML = '';
    const options = [question.meaning, ...vocabulary.filter(item => item.word !== question.word).slice(0, 3).map(item => item.meaning)];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option, i) => {
        const button = document.createElement('button');
        button.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });

    answerFeedback.classList.add('hidden');
    updateProgressBar(index + 1, quizQuestions.length);
}

// ✅ 퀴즈 정답 확인
function checkAnswer(selectedOption) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.meaning;

    if (isCorrect) {
        score += 2;
    } else {
        wrongAnswers.push(currentQuestion);
    }

    updateScoreDisplay();
    currentQuestionIndex++;

    setTimeout(() => {
        showQuestion(currentQuestionIndex);
    }, 1000);
}

// ✅ 점수 업데이트
function updateScoreDisplay() {
    scoreDisplaySpan.textContent = `점수: ${score}점`;
}

// ✅ 퀴즈 결과 표시
function showQuizResults() {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    finalScoreElement.textContent = `${score}점`;
}

function showNotification(message, isError) {
    notification.textContent = message;
    notification.classList.toggle('error', isError);
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
