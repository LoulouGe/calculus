var score = 0;
var correctAnswer = 0;
var currentOperation = 'add';

var SYMBOLS = { add: '+', sub: '-', mul: '×', div: '÷' };

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

// Start the game
function startGame() {
    score = 0;
    document.getElementById('score').innerText = '⭐ 0';
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    generateGame();
}

// Back to menu
function backToMenu() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'block';
}

// Generate a new question
function generateGame() {
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('answer').innerText = '?';

    var n1, n2;

    if (currentOperation === 'add') {
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = n1 + n2;
    } else if (currentOperation === 'sub') {
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * n1) + 1;
        correctAnswer = n1 - n2;
    } else if (currentOperation === 'mul') {
        n1 = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = n1 * n2;
    } else if (currentOperation === 'div') {
        n2 = Math.floor(Math.random() * 9) + 2;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        n1 = n2 * correctAnswer;
    }

    document.getElementById('num1').innerText = n1;
    document.getElementById('num2').innerText = n2;
    document.getElementById('operator').innerText = SYMBOLS[currentOperation];

    // Show a hint for multiplication and division
    var hint = document.getElementById('hint');
    if (currentOperation === 'mul') {
        // 5 × 3 => "5 + 5 + 5"
        var parts = [];
        for (var h = 0; h < n2; h++) {
            parts.push(n1);
        }
        hint.innerText = '💡 ' + parts.join(' + ');
    } else if (currentOperation === 'div') {
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
    var choices = [correctAnswer];
    while (choices.length < 4) {
        var offset = Math.floor(Math.random() * 10) + 1;
        var wrong = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
        if (wrong < 0) wrong = Math.floor(Math.random() * 10) + 1;
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
        score++;
        document.getElementById('score').innerText = '⭐ ' + score;
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('options').innerHTML = '<span class="dancing-unicorn">🦄</span>';
        showCelebration();
    } else {
        btn.disabled = true;
        btn.classList.add('wrong');
        btn.innerText = '❌ ' + selected;
    }
}
