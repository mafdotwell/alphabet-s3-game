document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const container = document.querySelector('.container');
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timerId = null;
    let matches = 0;

    // Pair configuration
    const pairs = [
        { id: 1, letterImg: 'images/A.png', objectImg: 'images/apple.jpeg' },
        { id: 2, letterImg: 'images/B.png', objectImg: 'images/ball.jpeg' },
        { id: 3, letterImg: 'images/C.png', objectImg: 'images/cat.jpeg' },
        { id: 4, letterImg: 'images/D.png', objectImg: 'images/dog.jpeg' },
        { id: 5, letterImg: 'images/E.png', objectImg: 'images/egg.jpeg' },
        { id: 6, letterImg: 'images/F.png', objectImg: 'images/fish.jpeg' }
    ];

    startButton.addEventListener('click', startGame);

    function startGame() {
        startButton.disabled = true;
        gameBoard.innerHTML = '';
        flippedCards = [];
        moves = 0;
        time = 0;
        matches = 0;
        
        if (timerId) clearInterval(timerId);
        timerId = setInterval(updateTimer, 1000);

        initStats();
        preloadAllImages();
        createGameBoard();
    }

    function preloadAllImages() {
        pairs.forEach(pair => {
            preloadImage(pair.letterImg);
            preloadImage(pair.objectImg);
        });
    }

    function preloadImage(src) {
        new Image().src = src;
    }

    function createGameBoard() {
        const cards = [];
        pairs.forEach(pair => {
            cards.push(createCard(pair.letterImg, pair.id));
            cards.push(createCard(pair.objectImg, pair.id));
        });
        
        shuffleArray(cards).forEach(card => {
            gameBoard.appendChild(card);
        });
    }

    function createCard(imgSrc, pairId) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = pairId;
        card.dataset.matched = 'false';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Game card ${pairId}`;

        card.appendChild(img);
        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (card.dataset.matched === 'true' || 
            flippedCards.length === 2 || 
            card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            updateStats();
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const pairMatch = card1.dataset.pairId === card2.dataset.pairId;

        if (pairMatch) {
            matches++;
            setTimeout(() => {
                removeMatchedCards(card1, card2);
                checkWinCondition();
            }, 500);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
            }, 1000);
        }
        flippedCards = [];
    }

    function removeMatchedCards(...cards) {
        cards.forEach(card => {
            card.dataset.matched = 'true';
            card.innerHTML = ''; // Remove image
            card.style.backgroundColor = '#3c404d'; // Match background
            card.classList.remove('flipped');
        });
    }

    function checkWinCondition() {
        if (matches === pairs.length) {
            clearInterval(timerId);
            setTimeout(() => {
                alert(`🏆 Winner! Time: ${time}s | Moves: ${moves}`);
                startButton.disabled = false;
            }, 500);
        }
    }

    function initStats() {
        let statsDiv = document.getElementById('stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'stats';
            statsDiv.className = 'stats';
            container.insertBefore(statsDiv, gameBoard);
        }
        updateStats();
    }

    function updateStats() {
        const statsDiv = document.getElementById('stats');
        if (statsDiv) {
            statsDiv.textContent = `Moves: ${moves} | Time: ${time}`;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateTimer() {
        time++;
        updateStats();
    }
});