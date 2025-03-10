document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timerId = null;
    let matches = 0;

    const pairs = [
        { id: 1, letter: 'images/A.png', image: 'images/apple.jpeg', combined: 'images/A-apple.jpg' },
        { id: 2, letter: 'images/B.png', image: 'images/ball.jpeg', combined: 'images/B-ball.jpg' },
        { id: 3, letter: 'images/C.png', image: 'images/cat.jpeg', combined: 'images/C-cat.jpg' },
        { id: 4, letter: 'images/D.png', image: 'images/dog.jpeg', combined: 'images/D-dog.jpg' },
        { id: 5, letter: 'images/E.png', image: 'images/egg.jpeg', combined: 'images/E-egg.jpg' },
        { id: 6, letter: 'images/F.png', image: 'images/fish.jpeg', combined: 'images/F-fish.jpg' }
    ];

    startButton.addEventListener('click', startGame);

    function startGame() {
        resetGameState();
        initializeGameBoard();
        startTimer();
    }

    function resetGameState() {
        startButton.disabled = true;
        gameBoard.innerHTML = '';
        flippedCards = [];
        moves = 0;
        time = 0;
        matches = 0;
        updateStats();
    }

    function initializeGameBoard() {
        preloadImages();
        const cards = pairs.flatMap(pair => [
            createCard(pair.letter, pair.id, 'letter'),
            createCard(pair.image, pair.id, 'image')
        ]);
        shuffleArray(cards).forEach(card => gameBoard.appendChild(card));
    }

    function createCard(imgSrc, pairId, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = pairId;
        card.dataset.type = type;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = '?';

        const back = document.createElement('div');
        back.className = 'card-back';
        
        const img = new Image();
        img.src = imgSrc;
        img.alt = type === 'letter' ? `Letter ${String.fromCharCode(64 + pairId)}` : `Image for ${String.fromCharCode(64 + pairId)}`;
        back.appendChild(img);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (card.classList.contains('matched') || 
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
        const isMatch = card1.dataset.pairId === card2.dataset.pairId;

        setTimeout(() => {
            if (isMatch) {
                handleMatchSuccess(card1, card2);
                if (matches === pairs.length) endGame();
            } else {
                resetFlippedCards();
            }
            flippedCards = [];
        }, 600);
    }

    function handleMatchSuccess(card1, card2) {
        matches++;
        const pair = pairs.find(p => p.id.toString() === card1.dataset.pairId);
        
        [card1, card2].forEach(card => {
            card.classList.add('matched');
            const img = card.querySelector('img');
            img.src = pair.combined;
            img.alt = `Combined ${pair.letter.split('/').pop().charAt(0)}-${pair.image.split('/').pop().split('.')[0]}`;
            img.style.objectFit = 'cover';
        });
    }

    function resetFlippedCards() {
        flippedCards.forEach(card => card.classList.remove('flipped'));
    }

    function endGame() {
        clearInterval(timerId);
        setTimeout(() => {
            alert(`🏆 Game Completed!\nTime: ${time}s\nMoves: ${moves}`);
            startButton.disabled = false;
        }, 500);
    }

    function preloadImages() {
        const images = [
            ...pairs.flatMap(p => [p.letter, p.image, p.combined])
        ];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onerror = () => console.error('Failed to load image:', src);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => {
            time++;
            updateStats();
        }, 1000);
    }

    function updateStats() {
        document.getElementById('stats').textContent = `Moves: ${moves} | Time: ${time}s`;
    }
});