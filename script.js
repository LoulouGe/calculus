var score = 0;
var correctAnswer = 0;
var currentOperation = 'add';
var currentLevel = 1;
var madeError = false;
var totalStars = parseInt(localStorage.getItem('totalStars')) || 0;
var questionNumber = 0;
var TOTAL_QUESTIONS = 10;

var SYMBOLS = { add: '+', sub: '-', mul: '×', div: '÷' };

// Show total stars on menu screen
function updateTotalStars() {
    document.getElementById('total-stars').innerText = '⭐ Total : ' + totalStars;
}
updateTotalStars();

// Select one operation (single choice)
function selectOperation(btn, op) {
    // Deselect all buttons
    var allBtns = document.querySelectorAll('.menu-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('selected');
    }
    // Select the clicked one
    btn.classList.add('selected');
    currentOperation = op;
}

// Select level (single choice)
function selectLevel(btn, level) {
    var allBtns = document.querySelectorAll('.level-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('selected');
    }
    btn.classList.add('selected');
    currentLevel = level;
}

// Start the game
function startGame() {
    score = 0;
    questionNumber = 0;
    document.getElementById('score').innerText = '⭐ 0';
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    generateGame();
}

// Back to menu
function backToMenu() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'block';
    updateTotalStars();
}

// Show end-of-series result screen
function showResult() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-score').innerText = score + ' / ' + (TOTAL_QUESTIONS * currentLevel);
    if (score === TOTAL_QUESTIONS * currentLevel) {
        showCelebration();
    }
}

// Generate a new question
function generateGame() {
    questionNumber++;
    document.getElementById('question-count').innerText = questionNumber + ' / ' + TOTAL_QUESTIONS;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('answer').innerText = '?';
    madeError = false;

    var n1, n2;

    // Helper: random integer between min and max (inclusive)
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (currentOperation === 'add') {
        if (currentLevel === 1)      { n1 = rand(1, 10);  n2 = rand(1, 10); }
        else if (currentLevel === 2) { n1 = rand(10, 50);  n2 = rand(10, 50); }
        else                         { n1 = rand(50, 200); n2 = rand(50, 200); }
        correctAnswer = n1 + n2;
    } else if (currentOperation === 'sub') {
        if (currentLevel === 1)      { n1 = rand(3, 10); }
        else if (currentLevel === 2) { n1 = rand(11, 50); }
        else                         { n1 = rand(51, 200); }
        n2 = rand(1, n1 - 1);
        correctAnswer = n1 - n2;
    } else if (currentOperation === 'mul') {
        if (currentLevel === 1)      { n1 = rand(2, 5);  n2 = rand(2, 5); }
        else if (currentLevel === 2) { n1 = rand(2, 10); n2 = rand(2, 10); }
        else                         { n1 = rand(2, 12); n2 = rand(2, 20); }
        correctAnswer = n1 * n2;
    } else if (currentOperation === 'div') {
        if (currentLevel === 1)      { n2 = rand(2, 5);  correctAnswer = rand(1, 5); }
        else if (currentLevel === 2) { n2 = rand(2, 10); correctAnswer = rand(1, 10); }
        else                         { n2 = rand(2, 12); correctAnswer = rand(2, 20); }
        n1 = n2 * correctAnswer;
    }

    document.getElementById('num1').innerText = n1;
    document.getElementById('num2').innerText = n2;
    document.getElementById('operator').innerText = SYMBOLS[currentOperation];

    // Show a hint for multiplication and division (levels 1 & 2 only)
    var hint = document.getElementById('hint');
    if (currentLevel <= 2 && currentOperation === 'mul') {
        // 5 × 3 => "5 + 5 + 5"
        var parts = [];
        for (var h = 0; h < n2; h++) {
            parts.push(n1);
        }
        hint.innerText = '💡 ' + parts.join(' + ');
    } else if (currentLevel <= 2 && currentOperation === 'div') {
        // 12 ÷ 3 => "3 + 3 + 3 + 3 = 12"
        var parts = [];
        for (var h = 0; h < correctAnswer; h++) {
            parts.push(n2);
        }
        hint.innerText = '💡 ' + parts.join(' + ') + ' = ' + n1;
    } else {
        hint.innerText = '';
    }

    // Generate 4 answer choices
    var maxOffset = currentLevel === 1 ? 5 : currentLevel === 2 ? 10 : 20;
    var choices = [correctAnswer];
    while (choices.length < 4) {
        var offset = Math.floor(Math.random() * maxOffset) + 1;
        var wrong = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
        if (wrong < 1) wrong = correctAnswer + Math.floor(Math.random() * maxOffset) + 1;
        if (choices.indexOf(wrong) === -1) choices.push(wrong);
    }
    choices.sort(function () { return Math.random() - 0.5; });

    var container = document.getElementById('options');
    container.innerHTML = '';
    var colors = ['btn-0', 'btn-1', 'btn-2', 'btn-3'];

    for (var i = 0; i < choices.length; i++) {
        var btn = document.createElement('button');
        btn.innerText = choices[i];
        btn.className = 'option-btn ' + colors[i];
        btn.setAttribute('onclick', 'checkAnswer(' + choices[i] + ', this)');
        container.appendChild(btn);
    }
}

// Show confetti rain + dancing unicorn
function showCelebration() {
    var emojis = ['🎉', '⭐', '🦄', '🌟', '✨'];
    for (var i = 0; i < 30; i++) {
        var el = document.createElement('span');
        el.className = 'confetti';
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDelay = Math.random() * 0.8 + 's';
        el.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
        document.body.appendChild(el);
    }
    // Clean up confetti after animation
    setTimeout(function () {
        var bits = document.querySelectorAll('.confetti');
        for (var j = 0; j < bits.length; j++) {
            bits[j].remove();
        }
    }, 3000);
}

// Check the selected answer
function checkAnswer(selected, btn) {
    if (selected === correctAnswer) {
        document.getElementById('answer').innerText = correctAnswer;
        if (!madeError) {
            score += currentLevel;
            totalStars += currentLevel;
            localStorage.setItem('totalStars', totalStars);
            document.getElementById('score').innerText = '⭐ ' + score;
            showCelebration();
        }
        document.getElementById('options').innerHTML = '<img src="unicorn.png" class="dancing-unicorn" alt="licorne">';
        if (questionNumber >= TOTAL_QUESTIONS) {
            // Last question: show result after a short delay
            setTimeout(showResult, 1500);
        } else {
            document.getElementById('next-btn').style.display = 'block';
        }
    } else {
        madeError = true;
        btn.disabled = true;
        btn.classList.add('wrong');
        btn.innerText = '❌ ' + selected;
    }
}
