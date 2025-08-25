const darkModeBtn = document.getElementById('darkModeToggle');
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Seleção de idade
const ageButtons = document.querySelectorAll('.age-buttons button');
const storiesSection = document.querySelector('.stories');
const quizSection = document.querySelector('.quiz');
const parentPanel = document.querySelector('.parent-panel');
const scoreEl = document.getElementById('score');
let score = 0;

ageButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    storiesSection.hidden = false;
  });
});

// Quizzes
const storyCards = document.querySelectorAll('.story-card');
const quizQuestion = document.querySelector('.quiz-question');
const quizOptions = document.querySelector('.quiz-options');
const quizFeedback = document.querySelector('.quiz-feedback');
const nextBtn = document.querySelector('.next-question');
const achievements = document.querySelector('.achievements');

const quizzes = {
  porquinhos: [
    { question: "Quantas casas os porquinhos construíram?", options: ["1","2","3"], answer: "3" }
  ],
  cachinhos: [
    { question: "Quem visitou a casa dos ursos?", options: ["Cachinhos Dourados","Chapeuzinho","João"], answer: "Cachinhos Dourados" }
  ],
  cigarra: [
    { question: "O que a cigarra fez no verão?", options: ["Cantou","Dormiu","Construiu casa"], answer: "Cantou" }
  ]
};

storyCards.forEach(card => {
  card.addEventListener('click', () => {
    storiesSection.hidden = true;
    quizSection.hidden = false;
    startQuiz(card.dataset.story);
  });
});

function startQuiz(story) {
  let currentIndex = 0;
  const currentQuiz = quizzes[story];
  
  function showQuestion() {
    const q = currentQuiz[currentIndex];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = "";
    quizFeedback.textContent = "";
    nextBtn.hidden = true;

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if(opt === q.answer){
          quizFeedback.textContent = "✅ Correto!";
          score += 10;
          scoreEl.textContent = score;
          achievements.innerHTML += `<li>Acertou: ${q.question}</li>`;
        } else {
          quizFeedback.textContent = "❌ Tente novamente!";
        }
        nextBtn.hidden = false;
      });
      quizOptions.appendChild(btn);
    });
  }

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if(currentIndex < currentQuiz.length){
      showQuestion();
    } else {
      quizSection.innerHTML = `<h2>🎉 Parabéns! Você terminou o quiz.</h2><button id="showPanel">Ver Painel do Responsável</button>`;
      document.getElementById('showPanel').addEventListener('click', () => {
        quizSection.hidden = true;
        parentPanel.hidden = false;
      });
    }
  });

  showQuestion();
}
