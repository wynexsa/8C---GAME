// Web Audio API Sound Synthesizer
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playCorrectSound() {
    initAudio();
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
}

function playWrongSound() {
    initAudio();
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
}

// Quiz Questions Data
const questions = [
    {
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        answer: 1
    },
    {
        question: "Hangisi bir programlama dili değildir?",
        options: ["Python", "HTML", "C++", "Java"],
        answer: 1
    },
    {
        question: "Güneş sistemine en yakın gezegen hangisidir?",
        options: ["Venüs", "Mars", "Merkür", "Jüpiter"],
        answer: 2
    },
    {
        question: "İstiklal Marşı'nın şairi kimdir?",
        options: ["Mehmet Akif Ersoy", "Orhan Veli", "Namık Kemal", "Atatürk"],
        answer: 0
    },
    {
        question: "Su hangi sıcaklıkta kaynar (normal atmosfer basıncında)?",
        options: ["90°C", "100°C", "110°C", "80°C"],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let answered = false;

function startGame() {
    initAudio();
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');
    updateStats();
    loadQuestion();
}

function updateStats() {
    document.getElementById('livesCount').innerText = lives;
    document.getElementById('scoreCount').innerText = score;
}

function loadQuestion() {
    answered = false;
    document.getElementById('nextBtn').style.display = 'none';
    
    const q = questions[currentQuestionIndex];
    document.getElementById('questionNum').innerText = `Soru ${currentQuestionIndex + 1} / ${questions.length}`;
    document.getElementById('questionText').innerText = q.question;

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsList.appendChild(btn);
    });
}

function selectOption(selectedIndex, btnElement) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');

    if (selectedIndex === q.answer) {
        btnElement.classList.add('correct');
        score += 20;
        playCorrectSound();
    } else {
        btnElement.classList.add('wrong');
        allBtns[q.answer].classList.add('correct');
        lives -= 1;
        playWrongSound();
    }

    updateStats();

    if (lives <= 0) {
        setTimeout(endGame, 1200);
    } else if (currentQuestionIndex < questions.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(endGame, 1500);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function endGame() {
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('gameoverScreen').classList.add('active');

    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const finalScore = document.getElementById('finalScore');

    finalScore.innerText = score;

    if (lives <= 0) {
        endTitle.innerText = "Canın Bitti!";
        endMessage.innerText = "Tüm canlarını kaybettin. Ulaştığın toplam puan:";
    } else {
        endTitle.innerText = "Tebrikler! Yarışmayı Tamamladın 🎉";
        endMessage.innerText = "Tüm soruları başarıyla bitirdin. Toplam puanın:";
    }
}

function restartGame() {
    document.getElementById('gameoverScreen').classList.remove('active');
    startGame();
}
