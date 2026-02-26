let score = 0;
let correctAnswer;

const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const operatorElement = document.getElementById('operator');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');

function generateGame() {
    // Cache le bouton suivant
    nextBtn.classList.add('hidden');
    document.getElementById('answer').innerText = "?";
    
    // Nombres simples pour un enfant de 4 ans (entre 1 et 5)
    let n1 = Math.floor(Math.random() * 5) + 1;
    let n2 = Math.floor(Math.random() * 5) + 1;
    
    // Pour l'instant, on reste sur l'addition pour ne pas la décourager
    // Tu pourras changer '+' par d'autres signes plus tard
    correctAnswer = n1 + n2;
    
    num1Element.innerText = n1;
    num2Element.innerText = n2;
    operatorElement.innerText = "+";

    // Générer des choix
    optionsContainer.innerHTML = '';
    let choices = [correctAnswer];
    while(choices.length < 4) {
        let r = Math.floor(Math.random() * 10) + 1;
        if(!choices.includes(r)) choices.push(r);
    }
    choices.sort(() => Math.random() - 0.5);

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.innerText = choice;
        btn.classList.add('option-btn', `btn-${index}`);
        btn.onclick = () => checkAnswer(choice);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if(selected === correctAnswer) {
        document.getElementById('answer').innerText = correctAnswer;
        score++;
        scoreElement.innerText = "⭐ " + score;
        nextBtn.classList.remove('hidden');
        optionsContainer.innerHTML = "<h1>🎉 BRAVO !</h1>";
    } else {
        alert("Essaye encore ! 😊");
    }
}

nextBtn.onclick = generateGame;

// Lancer le premier calcul
generateGame();