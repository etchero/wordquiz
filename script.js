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
const categorySelect = document.getElementById('word-category');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const statsButton = document.getElementById('show-stats');
const exportButton = document.getElementById('export-vocabulary');
const importButton = document.getElementById('import-vocabulary');
const fileInput = document.getElementById('import-file');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats');
const filterSelect = document.getElementById('category-filter');

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
const pronounceBtn = document.getElementById('pronounce-word');
const spacedRepetitionBtn = document.getElementById('spaced-repetition-quiz');

// 단어장 데이터 저장 (로컬 스토리지에서 불러오기)
let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 6;
let wrongAnswers = [];
let isReviewMode = false;
let statistics = JSON.parse(localStorage.getItem('wordStatistics')) || {};
let categories = JSON.parse(localStorage.getItem('wordCategories')) || ['미분류', '중요', '학교', '일상', '비즈니스', 'TOEIC', '여행'];

// 간단한 오프라인 사전 데이터 (실제로는 더 많은 단어 포함 필요)
const offlineDictionary = {
  "apple": "사과",
  "banana": "바나나",
  "orange": "오렌지",
  "grape": "포도",
  "strawberry": "딸기",
  "watermelon": "수박",
  "computer": "컴퓨터",
  "book": "책",
  "pen": "펜",
  "paper": "종이",
  "table": "테이블",
  "chair": "의자",
  "door": "문",
  "window": "창문",
  "house": "집",
  "car": "자동차",
  "bicycle": "자전거",
  "train": "기차",
  "airplane": "비행기",
  "school": "학교",
  "student": "학생",
  "teacher": "선생님",
  "friend": "친구",
  "family": "가족",
  "father": "아버지",
  "mother": "어머니",
  "brother": "형제",
  "sister": "자매",
  "dog": "개",
  "cat": "고양이",
  "bird": "새",
  "fish": "물고기",
  "water": "물",
  "food": "음식",
  "breakfast": "아침식사",
  "lunch": "점심식사",
  "dinner": "저녁식사",
  "time": "시간",
  "day": "날",
  "week": "주",
  "month": "월",
  "year": "년",
  "today": "오늘",
  "tomorrow": "내일",
  "yesterday": "어제",
  "weather": "날씨",
  "sun": "태양",
  "moon": "달",
  "star": "별",
  "rain": "비",
  "snow": "눈"
};

// 예문 데이터
const exampleSentences = {
  "apple": "An apple a day keeps the doctor away. (하루에 사과 한 개면 의사가 필요 없다.)",
  "banana": "Monkeys love to eat bananas. (원숭이는 바나나 먹는 것을 좋아한다.)",
  "orange": "I like to drink fresh orange juice. (나는 신선한 오렌지 주스를 마시는 것을 좋아한다.)",
  "computer": "I use my computer every day for work. (나는 매일 일을 위해 컴퓨터를 사용한다.)",
  "book": "She reads a book before going to bed. (그녀는 잠자기 전에 책을 읽는다.)",
  "time": "Time flies when you're having fun. (즐거울 때 시간은 빨리 간다.)",
};

// 초기화 함수
function init() {
  updateWordList();
  addEventListeners();
  updateCategoryDropdowns();
  checkDarkModePreference();
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
  
  // 발음 기능
  if (pronounceBtn) {
    pronounceBtn.addEventListener('click', pronounceCurrentWord);
  }
  
  // 간격 반복 학습 기능
  if (spacedRepetitionBtn) {
    spacedRepetitionBtn.addEventListener('click', startSpacedRepetitionQuiz);
  }
  
  // 다크 모드 전환
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
  
  // 통계 보기
  if (statsButton) {
    statsButton.addEventListener('click', showStatistics);
  }
  
  // 통계 모달 닫기
  if (closeStatsBtn) {
    closeStatsBtn.addEventListener('click', () => {
      statsModal.classList.add('hidden');
    });
  }
  
  // 내보내기/가져오기
  if (exportButton) {
    exportButton.addEventListener('click', exportVocabulary);
  }
  
  if (importButton) {
    importButton.addEventListener('click', () => {
      fileInput.click();
    });
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', importVocabulary);
  }
  
  // 카테고리 필터링
  if (filterSelect) {
    filterSelect.addEventListener('change', filterWordsByCategory);
  }
}

// 여러 단어 일괄 추가
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
  
  const selectedCategory = categorySelect ? categorySelect.value : '미분류';
  
  for (const word of words) {
    // 이미 추가된 단어인지 확인
    if (vocabulary.some(item => item.word.toLowerCase() === word.toLowerCase())) {
      duplicateCount++;
      continue;
    }
    
    // 단어 뜻 가져오기 (네이버 API 대신 오프라인 사전 사용)
    const meaning = await getMeaning(word);
    
    if (meaning) {
      vocabulary.push({
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        word: word,
        meaning: meaning,
        category: selectedCategory,
        dateAdded: new Date().toISOString(),
        lastReviewed: null,
        reviewCount: 0
      });
      
      // 통계 초기화
      initWordStatistics(word);
      
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
            meaning: userMeaning.trim(),
            category: selectedCategory,
            dateAdded: new Date().toISOString(),
            lastReviewed: null,
            reviewCount: 0
          });
          
          // 통계 초기화
          initWordStatistics(word);
          
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
}

// 단어 뜻 가져오기 (API 대신 오프라인 사전 사용)
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
}

// 수동으로 단어 추가
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
  
  const selectedCategory = categorySelect ? categorySelect.value : '미분류';
  
  // 단어 추가
  vocabulary.push({
    id: Date.now() + Math.random().toString(36).substr(2, 5),
    word: word,
    meaning: meaning,
    category: selectedCategory,
    dateAdded: new Date().toISOString(),
    lastReviewed: null,
    reviewCount: 0
  });
  
  // 통계 초기화
  initWordStatistics(word);
  
  // 저장 및 업데이트
  saveVocabulary();
  updateWordList();
  manualWordInput.value = '';
  manualMeaningInput.value = '';
  
  showNotification('단어가 추가되었습니다.', false);
}

// 단어 통계 초기화
function initWordStatistics(word) {
  statistics[word] = {
    totalAttempts: 0,
    correctAttempts: 0,
    lastAttempt: null,
    difficulty: 0, // 0(쉬움) ~ 10(어려움)
    nextReviewDate: new Date().toISOString()
  };
  saveStatistics();
}

// 단어 삭제
function deleteWord(id) {
  // 삭제할 단어 정보 찾기
  const wordToDelete = vocabulary.find(item => item.id === id);
  
  if (wordToDelete) {
    // 통계에서도 삭제
    if (statistics[wordToDelete.word]) {
      delete statistics[wordToDelete.word];
      saveStatistics();
    }
  }
  
  vocabulary = vocabulary.filter(item => item.id !== id);
  saveVocabulary();
  updateWordList();
  showNotification('단어가 삭제되었습니다.', false);
}

// 단어 수정 UI 표시
function showEditForm(id, word, meaning, category) {
  const row = document.getElementById(`word-${id}`);
  if (!row) return;
  
  // 카테고리 옵션 생성
  let categoryOptions = '';
  categories.forEach(cat => {
    categoryOptions += `<option value="${cat}" ${category === cat ? 'selected' : ''}>${cat}</option>`;
  });
  
  const editForm = `
    <td colspan="5">
      <div class="edit-word-form">
        <input type="text" value="${word}" id="edit-word-${id}">
        <input type="text" value="${meaning}" id="edit-meaning-${id}">
        <select id="edit-category-${id}">
          ${categoryOptions}
        </select>
        <button onclick="saveEdit('${id}')">저장</button>
        <button onclick="cancelEdit('${id}')">취소</button>
      </div>
    </td>
  `;
  
  row.innerHTML = editForm;
}

// 단어 수정 저장
function saveEdit(id) {
  const wordInput = document.getElementById(`edit-word-${id}`);
  const meaningInput = document.getElementById(`edit-meaning-${id}`);
  const categoryInput = document.getElementById(`edit-category-${id}`);
  
  if (!wordInput || !meaningInput) return;
  
  const newWord = wordInput.value.trim();
  const newMeaning = meaningInput.value.trim();
  const newCategory = categoryInput ? categoryInput.value : '미분류';
  
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
    const oldWord = vocabulary[index].word;
    
    // 단어가 변경된 경우 통계 데이터도 업데이트
    if (oldWord !== newWord && statistics[oldWord]) {
      statistics[newWord] = statistics[oldWord];
      delete statistics[oldWord];
      saveStatistics();
    }
    
    vocabulary[index].word = newWord;
    vocabulary[index].meaning = newMeaning;
    vocabulary[index].category = newCategory;
    
    saveVocabulary();
    updateWordList();
    showNotification('단어가 수정되었습니다.', false);
  }
}

// 단어 수정 취소
function cancelEdit(id) {
  updateWordList();
}

// 단어장 저장
function saveVocabulary() {
  localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
  localStorage.setItem('wordCategories', JSON.stringify(categories));
}

// 통계 저장
function saveStatistics() {
  localStorage.setItem('wordStatistics', JSON.stringify(statistics));
}

// 카테고리별 단어 필터링
function filterWordsByCategory() {
  const selectedCategory = filterSelect.value;
  updateWordList(selectedCategory);
}

// 카테고리 드롭다운 업데이트
function updateCategoryDropdowns() {
  if (!categorySelect || !filterSelect) return;
  
  // 중복 제거
  categories = [...new Set(categories)];
  
  // 드롭다운 옵션 업데이트
  [categorySelect, filterSelect].forEach(select => {
    select.innerHTML = '';
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
    
    // 필터 드롭다운에는 "전체" 옵션 추가
    if (select === filterSelect) {
      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = '전체 보기';
      select.insertBefore(allOption, select.firstChild);
      select.value = 'all';
    }
  });
}

// 단어 목록 업데이트
function updateWordList(filterCategory = 'all') {
  wordListTable.innerHTML = '';
  
  // 필터링된 단어 목록
  let filteredVocabulary = vocabulary;
  if (filterCategory !== 'all') {
    filteredVocabulary = vocabulary.filter(item => item.category === filterCategory);
  }
  
  filteredVocabulary.forEach((item, index) => {
    // 통계 데이터 가져오기
    const stats = statistics[item.word] || { 
      correctAttempts: 0, 
      totalAttempts: 0,
      difficulty: 0
    };
    
    // 정확도 계산
    const accuracy = stats.totalAttempts > 0 
      ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100) 
      : '-';
    
    // 난이도에 따른 배경색 결정
    let difficultyClass = '';
    if (stats.totalAttempts > 0) {
      if (stats.difficulty >= 7) {
        difficultyClass = 'high-difficulty';
      } else if (stats.difficulty >= 4) {
        difficultyClass = 'medium-difficulty';
      } else {
        difficultyClass = 'low-difficulty';
      }
    }
    
    const row = document.createElement('tr');
    row.id = `word-${item.id}`;
    row.className = difficultyClass;
    
    const category = item.category || '미분류';
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.word}</td>
      <td>${item.meaning}</td>
      <td>${category}</td>
      <td>
        <button class="action-button" onclick="pronounceWord('${item.word}')">발음</button>
        <button class="action-button" onclick="showEditForm('${item.id}', '${item.word}', '${item.meaning}', '${category}')">수정</button>
        <button class="action-button" onclick="deleteWord('${item.id}')">삭제</button>
      </td>
    `;
    
    wordListTable.appendChild(row);
  });
  
  // 단어 수 업데이트
  wordCountSpan.textContent = `(${vocabulary.length}개)`;
  
  // 퀴즈 시작 버튼 활성화/비활성화
  startQuizBtn.disabled = vocabulary.length < 4;
  if (spacedRepetitionBtn) {
    spacedRepetitionBtn.disabled = vocabulary.length < 4;
  }
}

// 단어 발음 읽기 (Web Speech API 사용)
function pronounceWord(word) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  } else {
    showNotification('이 브라우저는 음성 합성을 지원하지 않습니다.', true);
  }
}

// 현재 퀴즈 단어 발음 읽기
function pronounceCurrentWord() {
  if (currentQuestionIndex < quizQuestions.length) {
    pronounceWord(quizQuestions[currentQuestionIndex].word);
  }
}

// 퀴즈 시작
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
}

// 간격 반복 학습 퀴즈 시작
function startSpacedRepetitionQuiz() {
  if (vocabulary.length < 4) {
    showNotification('퀴즈를 시작하려면 최소 4개의 단어가 필요합니다.', true);
    return;
  }
  
  isReviewMode = false;
  
  // 학습 우선순위에 따라 문제 생성
  createSpacedRepetitionQuizQuestions();
  
  // 문제가 충분하지 않으면 알림
  if (quizQuestions.length < 4) {
    showNotification('복습할 단어가 충분하지 않습니다. 일반 퀴즈로 시작합니다.', false);
    createQuizQuestions();
  }
  
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
}

// 간격 반복 학습을 위한 문제 생성
function createSpacedRepetitionQuizQuestions() {
  // 현재 날짜
  const now = new Date();
  
  // 복습이 필요한 단어 선별
  const wordsNeedingReview = vocabulary.filter(item => {
    const stats = statistics[item.word];
    
    // 통계가 없거나 리뷰 날짜가 없는 경우 포함
    if (!stats || !stats.nextReviewDate) return true;
    
    // 복습 날짜가 현재보다 이전인 경우
    const nextReviewDate = new Date(stats.nextReviewDate);
    return nextReviewDate <= now;
  });
  
  // 난이도 순으로 정렬 (어려운 단어 우선)
  wordsNeedingReview.sort((a, b) => {
    const statsA = statistics[a.word] || { difficulty: 0 };
    const statsB = statistics[b.word] || { difficulty: 0 };
    return statsB.difficulty - statsA.difficulty;
  });
  
  // 최대 20개까지만 선택
  const selectedWords = wordsNeedingReview.slice(0, 20);
  
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
}

// 오답 복습 퀴즈 시작
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
}

// 랜덤 퀴즈 문제 생성
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
}

// 오답 복습용 퀴즈 문제 생성
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
}

// 배열에서 랜덤으로 지정된 개수의 항목 가져오기
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
// 문제 표시
function showQuestion(index) {
  if (index >= quizQuestions.length) {
    endQuiz();
    return;
  }
  
  const question = quizQuestions[index];
  
  // 문제 번호와 단어 표시
  questionNumberSpan.textContent = `${index + 1}/${quizQuestions.length}`;
  quizWordElement.textContent = question.word;
  
  // 정답 피드백 초기화
  answerFeedback.innerHTML = '';
  answerFeedback.className = '';
  
  // 보기 생성
  optionsContainer.innerHTML = '';
  question.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });
  
  // 타이머 시작
  startTimer();
}

// 타이머 시작
function startTimer() {
  clearInterval(timer);
  timeLeft = 30; // 30초 타이머
  updateTimerDisplay();
  
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeOut();
    }
  }, 1000);
}

// 타이머 표시 업데이트
function updateTimerDisplay() {
  timerElement.textContent = `${timeLeft}초`;
  
  // 10초 이하면 빨간색으로 강조
  if (timeLeft <= 10) {
    timerElement.className = 'timer-warning';
  } else {
    timerElement.className = '';
  }
}

// 시간 초과
function timeOut() {
  // 현재 문제 가져오기
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // 답 확인 버튼 비활성화
  const buttons = optionsContainer.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    
    // 정답 표시
    if (button.textContent === currentQuestion.correctAnswer) {
      button.className = 'option-button correct';
    }
  });
  
  // 오답 기록
  wrongAnswers.push({
    word: currentQuestion.word,
    correctAnswer: currentQuestion.correctAnswer,
    userAnswer: null, // 시간 초과로 응답 없음
    example: currentQuestion.example
  });
  
  // 단어의 난이도 증가
  updateWordStatistics(currentQuestion.word, false);
  
  // 피드백 표시
  answerFeedback.innerHTML = `
    <p>시간 초과! 정답은 <strong>${currentQuestion.correctAnswer}</strong> 입니다.</p>
    <p class="example">${currentQuestion.example}</p>
  `;
  answerFeedback.className = 'incorrect';
  
  // 3초 후 다음 문제
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }, 3000);
}

// 답 확인
function checkAnswer(selectedOption) {
  clearInterval(timer); // 타이머 중지
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
  // 정답/오답 표시
  const buttons = optionsContainer.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true; // 모든 버튼 비활성화
    
    if (button.textContent === selectedOption) {
      button.className = `option-button ${isCorrect ? 'correct' : 'incorrect'}`;
    } else if (button.textContent === currentQuestion.correctAnswer) {
      button.className = 'option-button correct';
    }
  });
  
  // 정답이면 점수 추가
  if (isCorrect) {
    score++;
    updateScoreDisplay();
    
    answerFeedback.innerHTML = `
      <p>정답입니다!</p>
      <p class="example">${currentQuestion.example}</p>
    `;
    answerFeedback.className = 'correct';
  } else {
    // 오답 기록
    wrongAnswers.push({
      word: currentQuestion.word,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: selectedOption,
      example: currentQuestion.example
    });
    
    answerFeedback.innerHTML = `
      <p>오답입니다. 정답은 <strong>${currentQuestion.correctAnswer}</strong> 입니다.</p>
      <p class="example">${currentQuestion.example}</p>
    `;
    answerFeedback.className = 'incorrect';
  }
  
  // 단어 통계 업데이트
  updateWordStatistics(currentQuestion.word, isCorrect);
  
  // 3초 후 다음 문제
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }, 3000);
}

// 단어 통계 업데이트
function updateWordStatistics(word, isCorrect) {
  // 통계 초기화
  if (!statistics[word]) {
    initWordStatistics(word);
  }
  
  const stats = statistics[word];
  stats.totalAttempts++;
  
  if (isCorrect) {
    stats.correctAttempts++;
    // 정답 시 난이도 감소 (최소 0)
    stats.difficulty = Math.max(0, stats.difficulty - 1);
  } else {
    // 오답 시 난이도 증가 (최대 10)
    stats.difficulty = Math.min(10, stats.difficulty + 2);
  }
  
  stats.lastAttempt = new Date().toISOString();
  
  // 다음 복습 날짜 계산 (간격 반복 학습 알고리즘)
  const nextReviewDays = calculateNextReviewInterval(stats.difficulty, isCorrect);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + nextReviewDays);
  stats.nextReviewDate = nextReview.toISOString();
  
  // 저장
  saveStatistics();
  
  // 단어장에서도 복습 횟수 업데이트
  const wordIndex = vocabulary.findIndex(item => item.word === word);
  if (wordIndex !== -1) {
    vocabulary[wordIndex].lastReviewed = new Date().toISOString();
    vocabulary[wordIndex].reviewCount = (vocabulary[wordIndex].reviewCount || 0) + 1;
    saveVocabulary();
  }
}

// 간격 반복 학습을 위한 다음 복습 간격 계산
function calculateNextReviewInterval(difficulty, isCorrect) {
  if (isCorrect) {
    // 난이도가 낮을수록(쉬울수록) 간격 길게
    switch (true) {
      case difficulty <= 2: return 14; // 2주
      case difficulty <= 5: return 7;  // 1주
      case difficulty <= 8: return 3;  // 3일
      default: return 1;               // 1일
    }
  } else {
    // 오답은 빠른 복습
    return 1; // 1일
  }
}

// 점수 표시 업데이트
function updateScoreDisplay() {
  scoreDisplaySpan.textContent = `${score}/${quizQuestions.length}`;
}

// 퀴즈 종료
function endQuiz() {
  clearInterval(timer);
  
  // 퀴즈 섹션 숨기고 결과 섹션 표시
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  
  // 최종 점수 계산 및 표시
  const percentage = Math.round((score / quizQuestions.length) * 100);
  finalScoreElement.textContent = `${score}/${quizQuestions.length} (${percentage}%)`;
  
  // 결과 메시지 결정
  let resultMessage;
  if (percentage >= 90) {
    resultMessage = "훌륭합니다! 단어 마스터에 한 걸음 더 가까워졌습니다!";
  } else if (percentage >= 70) {
    resultMessage = "좋은 성적입니다! 조금만 더 복습하세요.";
  } else if (percentage >= 50) {
    resultMessage = "나쁘지 않습니다. 오답을 중심으로 복습하세요.";
  } else {
    resultMessage = "단어를 더 많이 복습해야 합니다. 힘내세요!";
  }
  
  resultMessageElement.textContent = resultMessage;
  
  // 오답 목록 업데이트
  updateWrongAnswersList();
  
  // 오답 리뷰 버튼 활성화/비활성화
  reviewWrongAnswersBtn.disabled = wrongAnswers.length === 0;
}

// 오답 목록 업데이트
function updateWrongAnswersList() {
  wrongAnswersList.innerHTML = '';
  
  if (wrongAnswers.length === 0) {
    wrongAnswersList.innerHTML = '<li>오답이 없습니다. 축하합니다!</li>';
    return;
  }
  
  wrongAnswers.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${item.word}</strong>: ${item.correctAnswer}
      ${item.userAnswer ? `(선택한 답: ${item.userAnswer})` : '(시간 초과)'}
      <div class="example">${item.example}</div>
    `;
    wrongAnswersList.appendChild(listItem);
  });
}

// 단어장으로 돌아가기
function returnToVocabulary() {
  vocabularySection.classList.remove('hidden');
  quizSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  updateWordList();
}

// 알림 표시
function showNotification(message, isError) {
  notification.textContent = message;
  notification.className = isError ? 'notification error' : 'notification success';
  notification.classList.remove('hidden');
  
  // 3초 후 알림 숨기기
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// 단어장 내보내기
function exportVocabulary() {
  // 내보낼 데이터 생성
  const exportData = {
    vocabulary: vocabulary,
    statistics: statistics,
    categories: categories,
    version: "1.0"
  };
  
  // JSON 문자열로 변환
  const jsonString = JSON.stringify(exportData, null, 2);
  
  // 파일로 다운로드
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocabulary_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  
  // 정리
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
  
  showNotification('단어장이 성공적으로 내보내기 되었습니다.', false);
}

// 단어장 가져오기
function importVocabulary(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // 데이터 검증
      if (!data.vocabulary || !Array.isArray(data.vocabulary)) {
        throw new Error('잘못된 단어장 형식입니다.');
      }
      
      // 사용자에게 확인
      const confirmImport = confirm(
        `${data.vocabulary.length}개의 단어를 가져옵니다. 기존 단어장에 추가하시겠습니까? '취소'를 누르면 기존 단어장을 대체합니다.`
      );
      
      if (confirmImport) {
        // 기존 단어장에 추가
        const newWords = data.vocabulary.filter(newWord => 
          !vocabulary.some(existingWord => 
            existingWord.word.toLowerCase() === newWord.word.toLowerCase()
          )
        );
        
        vocabulary = [...vocabulary, ...newWords];
        
        // 새 통계 데이터 추가
        if (data.statistics) {
          statistics = { ...statistics, ...data.statistics };
        }
        
        // 새 카테고리 추가
        if (data.categories && Array.isArray(data.categories)) {
          categories = [...new Set([...categories, ...data.categories])];
        }
      } else {
        // 기존 단어장 대체
        vocabulary = data.vocabulary;
        
        if (data.statistics) {
          statistics = data.statistics;
        }
        
        if (data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
        }
      }
      
      // 저장 및 업데이트
      saveVocabulary();
      saveStatistics();
      updateCategoryDropdowns();
      updateWordList();
      
      showNotification('단어장을 성공적으로 가져왔습니다.', false);
    } catch (error) {
      showNotification('단어장 가져오기 실패: ' + error.message, true);
    }
    
    // 파일 입력 초기화
    fileInput.value = '';
  };
  
  reader.readAsText(file);
}

// 통계 보기
function showStatistics() {
  // 통계 모달 내용 업데이트
  const statsContent = document.getElementById('stats-content');
  if (!statsContent) return;
  
  // 기본 통계
  const totalWords = vocabulary.length;
  const totalReviews = Object.values(statistics).reduce((sum, stat) => sum + stat.totalAttempts, 0);
  const totalCorrect = Object.values(statistics).reduce((sum, stat) => sum + stat.correctAttempts, 0);
  const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
  
  // 난이도별 단어 수
  const difficultyStats = {
    easy: 0,   // 0-3
    medium: 0, // 4-6
    hard: 0    // 7-10
  };
  
  Object.values(statistics).forEach(stat => {
    if (stat.difficulty <= 3) difficultyStats.easy++;
    else if (stat.difficulty <= 6) difficultyStats.medium++;
    else difficultyStats.hard++;
  });
  
  // 카테고리별 단어 수
  const categoryStats = {};
  vocabulary.forEach(word => {
    const category = word.category || '미분류';
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  // 통계 HTML 생성
  let html = `
    <h3>단어장 통계</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalWords}</div>
        <div class="stat-label">총 단어 수</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${totalReviews}</div>
        <div class="stat-label">총 학습 횟수</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${overallAccuracy}%</div>
        <div class="stat-label">전체 정확도</div>
      </div>
    </div>
    
    <h3>난이도별 단어 수</h3>
    <div class="stats-grid">
      <div class="stat-card easy">
        <div class="stat-number">${difficultyStats.easy}</div>
        <div class="stat-label">쉬움</div>
      </div>
      <div class="stat-card medium">
        <div class="stat-number">${difficultyStats.medium}</div>
        <div class="stat-label">보통</div>
      </div>
      <div class="stat-card hard">
        <div class="stat-number">${difficultyStats.hard}</div>
        <div class="stat-label">어려움</div>
      </div>
    </div>
    
    <h3>카테고리별 단어 수</h3>
    <div class="stats-category">
  `;
  
  // 카테고리별 통계 추가
  Object.entries(categoryStats).forEach(([category, count]) => {
    html += `
      <div class="category-item">
        <span class="category-name">${category}</span>
        <span class="category-count">${count}</span>
      </div>
    `;
  });
  
  html += `
    </div>
    
    <h3>학습 추천</h3>
    <ul class="stats-recommendations">
  `;
  
  // 학습 추천 사항 추가
  if (totalWords < 10) {
    html += `<li>단어장에 더 많은 단어를 추가하세요.</li>`;
  }
  
  if (difficultyStats.hard > 0) {
    html += `<li>어려운 단어 ${difficultyStats.hard}개를 집중적으로 복습하세요.</li>`;
  }
  
  if (overallAccuracy < 70) {
    html += `<li>정확도가 낮습니다. 더 많은 복습이 필요합니다.</li>`;
  }
  
  // 오늘 복습할 단어 수 계산
  const today = new Date();
  const wordsToReviewToday = vocabulary.filter(word => {
    const stats = statistics[word.word];
    if (!stats || !stats.nextReviewDate) return true;
    
    const reviewDate = new Date(stats.nextReviewDate);
    return reviewDate <= today;
  }).length;
  
  html += `<li>오늘 복습할 단어: ${wordsToReviewToday}개</li>`;
  html += `</ul>`;
  
  statsContent.innerHTML = html;
  statsModal.classList.remove('hidden');
}

// 다크 모드 전환
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  // 다크 모드 아이콘 업데이트
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
  }
}

// 다크 모드 설정 확인
function checkDarkModePreference() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '☀️';
    }
  }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', init);
