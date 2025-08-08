const quizData = {
   easy: [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      answer: "Paris"
    },
    {
      question: "Which is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      answer: "2"
    },
    {
      question: "Which animal is known as the 'King of the Jungle'?",
      options: ["Elephant", "Tiger", "Lion", "Bear"],
      answer: "Lion"
    }
  ],
  medium: [
    {
      question: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      answer: "Cascading Style Sheets"
    },
    {
      question: "What is the value of π (pi) approximately?",
      options: ["2.14", "3.14", "4.14", "5.14"],
      answer: "3.14"
    },
    {
      question: "In which year did World War II end?",
      options: ["1945", "1939", "1918", "1950"],
      answer: "1945"
    }
  ],
  hard: [
    {
      question: "Which programming language is known as the backbone of the web?",
      options: ["Python", "Java", "JavaScript", "C++"],
      answer: "JavaScript"
    },
    {
      question: "What is the chemical formula of table salt?",
      options: ["NaCl", "H2O", "CO2", "CH4"],
      answer: "NaCl"
    },
    {
      question: "What is the smallest unit of memory?",
      options: ["KB", "Byte", "Bit", "MB"],
      answer: "Bit"
    }
  ]
};

const quizBox = document.getElementById("quiz");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const feedback = document.getElementById("feedback");
const resultScreen = document.getElementById("resultScreen");
const scoreSummary = document.getElementById("scoreSummary");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timer");
const questionCountDisplay = document.getElementById("questionCount");
const themeToggle = document.getElementById("themeToggle");
const difficultySelect = document.getElementById("difficulty");
const progressBar = document.getElementById("progress");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

function startQuiz() {
  resultScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 15;
  feedback.textContent = "";
  nextBtn.disabled = true;
  loadQuestions();
  showQuestion();
  updateProgress();
}


function loadQuestions() {
  const difficulty = difficultySelect.value;
  questions = [...quizData[difficulty]];
  shuffleArray(questions);
}

function showQuestion() {
  clearInterval(timer);
  startTimer();
  feedback.textContent = "";
  nextBtn.disabled = true;

  const current = questions[currentQuestionIndex];
  questionText.textContent = current.question;
  optionsContainer.innerHTML = "";

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = option;
    btn.addEventListener("click", () => selectOption(btn, current.answer));
    optionsContainer.appendChild(btn);
  });

  questionCountDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function selectOption(selectedBtn, correctAnswer) {
  const options = document.querySelectorAll(".option-btn");
  options.forEach(btn => btn.disabled = true);

  if (selectedBtn.textContent === correctAnswer) {
    selectedBtn.classList.add("correct");
    feedback.textContent = "✅ Correct!";
    score++;
  } else {
    selectedBtn.classList.add("wrong");
    feedback.textContent = `❌ Wrong! Answer: ${correctAnswer}`;
    options.forEach(btn => {
      if (btn.textContent === correctAnswer) btn.classList.add("correct");
    });
  }

  nextBtn.disabled = false;
  clearInterval(timer);
  updateProgress();
}

function showResult() {
  quizBox.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const percent = (score / questions.length) * 100;
  if (percent >= 80) {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  scoreSummary.innerHTML = `
    You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>.<br>
    ${getPerformanceText()}
  `;
  showChart(score, questions.length); // Already present if chart is added
}


function getPerformanceText() {
  const percent = (score / questions.length) * 100;
  if (percent >= 80) return "🌟 Excellent performance!";
  if (percent >= 50) return "👍 Good job!";
  return "📘 Keep practicing!";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function startTimer() {
  timeLeft = 15;
  timerDisplay.textContent = `⏱️ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoRevealAnswer();
    }
  }, 1000);
}

function autoRevealAnswer() {
  const current = questions[currentQuestionIndex];
  feedback.textContent = `⏰ Time's up! Answer: ${current.answer}`;
  const options = document.querySelectorAll(".option-btn");
  options.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === current.answer) btn.classList.add("correct");
  });
  nextBtn.disabled = false;
}

function updateProgress() {
  const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Events
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);
difficultySelect.addEventListener("change", startQuiz);
document.getElementById("dailyBtn").addEventListener("click", startDailyChallenge);


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
  startQuiz();
});

function startDailyChallenge() {
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const lastPlayed = localStorage.getItem("lastDaily");

  if (lastPlayed === today) {
    alert("You've already completed today's challenge!");
    return;
  }

  const allQuestions = [...quizData.easy, ...quizData.medium, ...quizData.hard];
  const hash = today.split("-").join(""); // e.g. "20250803"
  const index = parseInt(hash) % allQuestions.length;
  const dailyQuestion = allQuestions[index];

  questions = [dailyQuestion];
  currentQuestionIndex = 0;
  score = 0;
  feedback.textContent = "";
  nextBtn.disabled = true;
  resultScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  showQuestion();
  updateProgress();

  localStorage.setItem("lastDaily", today);
}

 
