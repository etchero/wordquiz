// 영어 단어장과 퀴즈 프로그램
// DOM 요소들
const batchWordsInput = document.getElementById('batch-words');
const addBatchWordsBtn = document.getElementById('add-batch-words');
const manualWordInput = document.getElementById('manual-word');
const manualMeaningInput = document.getElementById('manual-meaning');
const addManualWordBtn = document.getElementById('add-manual-word');
const wordListTable = document.getElementById('word-list').querySelector('tbody');
const wordCountSpan = document.getElementById('word-count');
const startQuizBtn = document.getElementById('start-quiz');
const vocabularySection = document.getElementById('vocabulary-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
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
// 단어장 선택 UI 요소
const databaseSelector = document.getElementById('database-selector');
const loadDatabaseBtn = document.getElementById('load-database');
const clearCurrentBtn = document.getElementById('clear-current');
// 단어장 데이터 저장 (로컬 스토리지에서 불러오기)
let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 6;
let wrongAnswers = [];
let isReviewMode = false;
// 간단한 오프라인 사전 데이터 (실제로는 더 많은 단어 포함 필요)
const offlineDictionary = {
  /* 기존 코드 유지 */
};

// 여기에 vocabularyDatabases 객체 추가
// 학교급별 단어 데이터베이스
const vocabularyDatabases = {
  // 기존 사전
  'general': offlineDictionary,
  
  // 초등학교 필수 단어 (샘플)
  'elementary': {
    "hello": "안녕",
    "world": "세계",
    /* 나머지 단어 */
  },
  
  // 중학교 필수 단어 (샘플)
  'middle': {
    "achieve": "성취하다",
    "adventure": "모험, 모험하다",
    /* 나머지 단어 */
  },
  
  // 고등학교 필수 단어 (샘플)
  'high': {
    "abandon": "버리다, 떠나다",
    "abolish": "폐지하다",
    /* 나머지 단어 */
  }
};
// 초기화 함수
function init() {
  updateWordList();
  addEventListeners();
}// 이벤트 리스너 등록
function addEventListeners() {
  // 단어 추가 이벤트
  addBatchWordsBtn.addEventListener('click', addBatchWords);
  addManualWordBtn.addEventListener('click', addManualWord);
  
  // 퀴즈 관련 이벤트
  startQuizBtn.addEventListener('click', startQuiz);
  reviewWrongAnswersBtn.addEventListener('click', startWrongAnswersReview);
  returnToVocabularyBtn.addEventListener('click', returnToVocabulary);
}// 여러 단어 일괄 추가
async function addBatchWords() {
  const input = batchWordsInput.value.trim();
  if (!input) {
    showNotification('단어를 입력해주세요.', true);
    return;
  }
  
  // 쉼표나 줄바꿈으로 분리
  const words = input.split(/[,\n]/).map(word => word.trim()).filter(word => word);
  
  if (words.length === 0) {
    showNotification('유효한 단어를 찾을 수 없습니다.', true);
    return;
  }
  
  let addedCount = 0;
  let duplicateCount = 0;
  let notFoundCount = 0;
  
  for (const word of words) {
    // 이미 추가된 단어인지 확인
    if (vocabulary.some(item => item.word.toLowerCase() === word.toLowerCase())) {
      duplicateCount++;
      continue;
    }
    // 선택한 데이터베이스의 단어를 추가하는 함수
function loadSelectedDatabase() {
  const selected = databaseSelector.value;
  
  if (!selected || !vocabularyDatabases[selected]) {
    showNotification('데이터베이스를 선택해주세요.', true);
    return;
  }
  
  const selectedDB = vocabularyDatabases[selected];
  let addedCount = 0;
  let duplicateCount = 0;
  
  // 각 단어를 단어장에 추가
  for (const [word, meaning] of Object.entries(selectedDB)) {
    // 이미 추가된 단어인지 확인
    if (vocabulary.some(item => item.word.toLowerCase() === word.toLowerCase())) {
      duplicateCount++;
      continue;
    }
    
    // 단어 추가
    vocabulary.push({
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      word: word,
      meaning: meaning
    });
    addedCount++;
  }
  
  // 결과 저장 및 업데이트
  saveVocabulary();
  updateWordList();
  
  // 결과 알림
  let message = `${addedCount}개 단어가 추가되었습니다.`;
  if (duplicateCount > 0) message += ` ${duplicateCount}개 중복 단어가 무시되었습니다.`;
  
  showNotification(message, false);
}

// 현재 단어장 비우기
function clearCurrentVocabulary() {
  if (vocabulary.length === 0) {
    showNotification('단어장이 이미 비어있습니다.', true);
    return;
  }
  
  if (confirm('현재 단어장을 모두 비우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    vocabulary = [];
    saveVocabulary();
    updateWordList();
    showNotification('단어장이 비워졌습니다.', false);
  }
}

// 이벤트 리스너 등록
function addEventListeners() {
  // 단어 추가 이벤트
  addBatchWordsBtn.addEventListener('click', addBatchWords);
  addManualWordBtn.addEventListener('click', addManualWord);
  
  // 퀴즈 관련 이벤트
  startQuizBtn.addEventListener('click', startQuiz);
  reviewWrongAnswersBtn.addEventListener('click', startWrongAnswersReview);
  returnToVocabularyBtn.addEventListener('click', returnToVocabulary);
  
  // 여기에 데이터베이스 이벤트 리스너 추가
  addDatabaseEventListeners();
}
    // 단어 뜻 가져오기 (네이버 API 대신 오프라인 사전 사용)
    const meaning = await getMeaning(word);
    
    if (meaning) {
      vocabulary.push({
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        word: word,
        meaning: meaning
      });
      addedCount++;
    } else {
      notFoundCount++;
      
      // 뜻을 찾지 못했을 때 사용자에게 알림
      if (confirm(`"${word}" 단어의 뜻을 찾을 수 없습니다. 직접 입력하시겠습니까?`)) {
        const userMeaning = prompt(`"${word}"의 뜻을 입력해주세요:`);
        if (userMeaning && userMeaning.trim()) {
          vocabulary.push({
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            word: word,
            meaning: userMeaning.trim()
          });
          addedCount++;
          notFoundCount--;
        }
      }
    }
  }
  
  // 결과 저장 및 업데이트
  saveVocabulary();
  updateWordList();
  batchWordsInput.value = '';
  
  // 결과 알림
  let message = `${addedCount}개 단어가 추가되었습니다.`;
  if (duplicateCount > 0) message += ` ${duplicateCount}개 중복 단어가 무시되었습니다.`;
  if (notFoundCount > 0) message += ` ${notFoundCount}개 단어의 뜻을 찾지 못했습니다.`;
  
  showNotification(message, false);
}// 단어 뜻 가져오기 (API 대신 오프라인 사전 사용)
async function getMeaning(word) {
  // 실제 API 호출 부분은 네이버 API가 필요하므로 여기서는 오프라인 사전 사용
  // 실제 구현 시에는 fetch로 API 호출 코드로 대체 필요
  
  const normalizedWord = word.toLowerCase().trim();
  
  // 오프라인 사전에서 검색
  if (offlineDictionary[normalizedWord]) {
    return offlineDictionary[normalizedWord];
  }
  
  // 실제로는 여기서 API 호출 코드 필요
  // 예: return await fetchFromNaverDictionary(normalizedWord);
  
  return null; // 찾지 못한 경우
}// 수동으로 단어 추가
function addManualWord() {
  const word = manualWordInput.value.trim();
  const meaning = manualMeaningInput.value.trim();
  
  if (!word || !meaning) {
    showNotification('단어와 뜻을 모두 입력해주세요.', true);
    return;
  }
  
  // 중복 확인
  if (vocabulary.some(item => item.word.toLowerCase() === word.toLowerCase())) {
    showNotification('이미 추가된 단어입니다.', true);
    return;
  }
  
  // 단어 추가
  vocabulary.push({
    id: Date.now() + Math.random().toString(36).substr(2, 5),
    word: word,
    meaning: meaning
  });
  
  // 저장 및 업데이트
  saveVocabulary();
  updateWordList();
  manualWordInput.value = '';
  manualMeaningInput.value = '';
  
  showNotification('단어가 추가되었습니다.', false);
}// 단어 삭제
function deleteWord(id) {
  vocabulary = vocabulary.filter(item => item.id !== id);
  saveVocabulary();
  updateWordList();
  showNotification('단어가 삭제되었습니다.', false);
}// 단어 수정 UI 표시
function showEditForm(id, word, meaning) {
  const row = document.getElementById(`word-${id}`);
  if (!row) return;
  
  const editForm = `
    <td colspan="4">
      <div class="edit-word-form">
        <input type="text" value="${word}" id="edit-word-${id}">
        <input type="text" value="${meaning}" id="edit-meaning-${id}">
        <button onclick="saveEdit('${id}')">저장</button>
        <button onclick="cancelEdit('${id}')">취소</button>
      </div>
    </td>
  `;
  
  row.innerHTML = editForm;
}// 단어 수정 저장
function saveEdit(id) {
  const wordInput = document.getElementById(`edit-word-${id}`);
  const meaningInput = document.getElementById(`edit-meaning-${id}`);
  
  if (!wordInput || !meaningInput) return;
  
  const newWord = wordInput.value.trim();
  const newMeaning = meaningInput.value.trim();
  
  if (!newWord || !newMeaning) {
    showNotification('단어와 뜻을 모두 입력해주세요.', true);
    return;
  }
  
  // 중복 확인 (자기 자신은 제외)
  const isDuplicate = vocabulary.some(item => 
    item.id !== id && item.word.toLowerCase() === newWord.toLowerCase()
  );
  
  if (isDuplicate) {
    showNotification('이미 존재하는 단어입니다.', true);
    return;
  }
  
  // 수정
  const index = vocabulary.findIndex(item => item.id === id);
  if (index !== -1) {
    vocabulary[index].word = newWord;
    vocabulary[index].meaning = newMeaning;
    
    saveVocabulary();
    updateWordList();
    showNotification('단어가 수정되었습니다.', false);
  }
}// 단어 수정 취소
function cancelEdit(id) {
  updateWordList();
}// 단어장 저장
function saveVocabulary() {
  localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
}// 단어 목록 업데이트
function updateWordList() {
  wordListTable.innerHTML = '';
  
  vocabulary.forEach((item, index) => {
    const row = document.createElement('tr');
    row.id = `word-${item.id}`;
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.word}</td>
      <td>${item.meaning}</td>
      <td>
        <button class="action-button" onclick="showEditForm('${item.id}', '${item.word}', '${item.meaning}')">수정</button>
        <button class="action-button" onclick="deleteWord('${item.id}')">삭제</button>
      </td>
    `;
    
    wordListTable.appendChild(row);
  });
  
  // 단어 수 업데이트
  wordCountSpan.textContent = `(${vocabulary.length}개)`;
  
  // 퀴즈 시작 버튼 활성화/비활성화
  startQuizBtn.disabled = vocabulary.length < 4;
}// 퀴즈 시작
function startQuiz() {
  if (vocabulary.length < 4) {
    showNotification('퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.', true);
    return;
  }
  
  isReviewMode = false;
  
  // 랜덤으로 문제 생성
  createQuizQuestions();
  
  // 단어장 숨기고 퀴즈 섹션 표시
  vocabularySection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
  
  // 퀴즈 시작 초기화
  currentQuestionIndex = 0;
  score = 0;
  wrongAnswers = [];
  updateScoreDisplay();
  
  // 첫 문제 표시
  showQuestion(0);
}// 오답 복습 퀴즈 시작
function startWrongAnswersReview() {
  if (wrongAnswers.length === 0) {
    showNotification('복습할 오답이 없습니다.', true);
    return;
  }
  
  isReviewMode = true;
  
  // 오답으로만 문제 생성
  createReviewQuizQuestions();
  
  // 결과 화면 숨기고 퀴즈 섹션 표시
  resultSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  
  // 퀴즈 시작 초기화
  currentQuestionIndex = 0;
  score = 0;
  updateScoreDisplay();
  
  // 첫 문제 표시
  showQuestion(0);
}// 랜덤 퀴즈 문제 생성
function createQuizQuestions() {
  // 단어장에서 최대 50개 무작위 선택
  const shuffledVocabulary = [...vocabulary].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledVocabulary.slice(0, Math.min(50, shuffledVocabulary.length));
  
  quizQuestions = selectedWords.map(item => {
    // 오답 보기 4개 생성
    const otherItems = vocabulary.filter(other => other.id !== item.id);
    const wrongOptions = getRandomItems(otherItems, 4)
      .map(wrongItem => wrongItem.meaning);
    
    // 5개 보기 무작위 섞기
    const allOptions = [...wrongOptions, item.meaning].sort(() => Math.random() - 0.5);
    
    return {
      word: item.word,
      correctAnswer: item.meaning,
      options: allOptions,
      // 예문이 있으면 사용, 없으면 기본 메시지
      example: exampleSentences[item.word.toLowerCase()] || `${item.word}: ${item.meaning}`
    };
  });
}// 오답 복습용 퀴즈 문제 생성
function createReviewQuizQuestions() {
  quizQuestions = wrongAnswers.map(item => {
    // 오답 보기 4개 생성
    const otherItems = vocabulary.filter(other => other.word !== item.word);
    const wrongOptions = getRandomItems(otherItems, 4)
      .map(wrongItem => wrongItem.meaning);
    
    // 5개 보기 무작위 섞기
    const allOptions = [...wrongOptions, item.correctAnswer].sort(() => Math.random() - 0.5);
    
    return {
      word: item.word,
      correctAnswer: item.correctAnswer,
      options: allOptions,
      example: item.example
    };
  });
}// 배열에서 랜덤으로 지정된 개수의 항목 가져오기
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}// 퀴즈 문제 표시
function showQuestion(index) {
  if (index >= quizQuestions.length) {
    showQuizResults();
    return;
  }
  
  const question = quizQuestions[index];
  
  // 문제 번호 업데이트
  questionNumberSpan.textContent = `문제 ${index + 1}/${quizQuestions.length}`;
  
  // 단어 표시
  quizWordElement.textContent = question.word;
  
  // 보기 생성
  optionsContainer.innerHTML = '';
  question.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });
  
  // 피드백 숨기기
  answerFeedback.classList.add('hidden');
  
  // 타이머 시작
  startTimer();
}// 타이머 시작
function startTimer() {
  clearInterval(timer);
  timeLeft = 6;
  timerElement.textContent = timeLeft;
  timerElement.classList.remove('warning');
  
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    if (timeLeft <= 2) {
      timerElement.classList.add('warning');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeOut();
    }
  }, 1000);
}// 시간 초과 처리
function timeOut() {
  // 모든 옵션 버튼 비활성화
  const optionButtons = optionsContainer.querySelectorAll('.option-button');
  optionButtons.forEach(button => {
    button.disabled = true;
    
    // 정답 표시
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (button.textContent.includes(currentQuestion.correctAnswer)) {
      button.classList.add('correct');
    }
  });
  
  // 정답 피드백 표시
  showAnswerFeedback(false);
  
  // 오답 목록에 추가
  wrongAnswers.push({
    word: quizQuestions[currentQuestionIndex].word,
    correctAnswer: quizQuestions[currentQuestionIndex].correctAnswer,
    example: quizQuestions[currentQuestionIndex].example
  });
  
  // 1.5초 후 다음 문제로
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }, 1500);
}// 정답 확인
function checkAnswer(selectedOption) {
  clearInterval(timer);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
  // 모든 옵션 버튼 비활성화
  const optionButtons = optionsContainer.querySelectorAll('.option-button');
  optionButtons.forEach(button => {
    button.disabled = true;
    
    if (button.textContent.includes(currentQuestion.correctAnswer)) {
      button.classList.add('correct');
    } else if (button.textContent.includes(selectedOption) && !isCorrect) {
      button.classList.add('incorrect');
    }
  });
  
  // 정답이면 점수 추가
  if (isCorrect) {
    score += 2; // 문항당 2점
    updateScoreDisplay();
  } else {
    // 오답 목록에 추가
    wrongAnswers.push({
      word: currentQuestion.word,
      correctAnswer: currentQuestion.correctAnswer,
      example: currentQuestion.example
    });
  }
  
  // 정답 피드백 표시
  showAnswerFeedback(isCorrect);
  
  // 1.5초 후 다음 문제로
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }, 1500);
}// 정답 피드백 표시
function showAnswerFeedback(isCorrect) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  answerFeedback.classList.remove('hidden');
  const feedbackText = answerFeedback.querySelector('.feedback-text');
  const exampleText = answerFeedback.querySelector('.example-text');
  
  if (isCorrect) {
    feedbackText.textContent = '정답입니다! 👏';
  } else {
    feedbackText.textContent = `오답입니다. 정답은 "${currentQuestion.correctAnswer}"입니다.`;
  }
  
  exampleText.textContent = currentQuestion.example;
}// 점수 표시 업데이트
function updateScoreDisplay() {
  scoreDisplaySpan.textContent = `점수: ${score}점`;
}// 퀴즈 결과 표시
function showQuizResults() {
  // 타이머 정지
  clearInterval(timer);
  
  // 퀴즈 섹션 숨기고 결과 섹션 표시
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  
  // 최종 점수 계산 (100점 만점으로 변환)
  const totalPossibleScore = quizQuestions.length * 2;
  const finalScorePercent = Math.round((score / totalPossibleScore) * 100);
  
  // 점수 표시
  finalScoreElement.textContent = finalScorePercent;
  
 // 점수에 따른 색상과 메시지
if (finalScorePercent === 100) {
  finalScoreElement.style.color = '#2ecc71';
  resultMessageElement.textContent = '만점이라니 대박! 축하해!';
} else if (finalScorePercent >= 95) {
  finalScoreElement.style.color = '#2ecc71';
  resultMessageElement.textContent = '오~ 잘 외웠구나! 잘했어!';
} else if (finalScorePercent >= 90) {
  finalScoreElement.style.color = '#2ecc71';
  resultMessageElement.textContent = '곧 고득점도 가능한 실력! 대단해!';
} else if (finalScorePercent >= 85) {
  finalScoreElement.style.color = '#3498db';
  resultMessageElement.textContent = '평소 ★표기한 단어 재암기 신경 써보자!';
} else if (finalScorePercent >= 80) {
  finalScoreElement.style.color = '#3498db';
  resultMessageElement.textContent = '다시 도전! 눈으로만 보지 말고 발음하며 암기해야 해!';
} else {
  finalScoreElement.style.color = '#e74c3c';
  resultMessageElement.textContent = '에구 아쉽다! 다시 처음부터 공부해보자!';
}  
  // 오답 목록 표시
  wrongAnswersList.innerHTML = '';
  
  if (wrongAnswers.length > 0) {
    wrongAnswers.forEach(item => {
      const wrongItem = document.createElement('div');
      wrongItem.className = 'wrong-answer-item';
      wrongItem.innerHTML = `
        <span class="wrong-word">${item.word}</span> - 
        <span class="correct-meaning">${item.correctAnswer}</span>
        <p class="example-text">${item.example}</p>
      `;
      wrongAnswersList.appendChild(wrongItem);
    });
    
    // 오답 복습 버튼 표시
    reviewWrongAnswersBtn.classList.remove('hidden');
  } else {
    wrongAnswersList.innerHTML = '<p>모든 문제를 맞추셨습니다! 👍</p>';
    reviewWrongAnswersBtn.classList.add('hidden');
  }
}// 단어장으로 돌아가기
function returnToVocabulary() {
  resultSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  vocabularySection.classList.remove('hidden');
}// 알림 표시
function showNotification(message, isError) {
  notification.textContent = message;
  notification.className = 'notification';
  
  if (isError) {
    notification.classList.add('error');
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}// 전역 함수 등록 (HTML에서 직접 호출 가능하도록)
window.deleteWord = deleteWord;
window.showEditForm = showEditForm;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
