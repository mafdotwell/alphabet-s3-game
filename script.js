document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timerId = null;
    let matches = 0;

    const pairs = [
        { id: 1, letter: 'A', image: 'images/apple.jpeg' },
        { id: 2, letter: 'B', image: 'images/ball.jpeg' },
        { id: 3, letter: 'C', image: 'images/cat.jpeg' },
        { id: 4, letter: 'D', image: 'images/dog.jpeg' },
        { id: 5, letter: 'E', image: 'images/egg.jpeg' },
        { id: 6, letter: 'F', image: 'images/fish.jpeg' }
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
        preloadImages();
        createGameBoard();
    }

    function createGameBoard() {
        const cards = [];
        pairs.forEach(pair => {
            cards.push(createCard(pair.letter, pair.id, 'letter'));
            cards.push(createCard(pair.image, pair.id, 'image'));
        });
        
        shuffleArray(cards).forEach(card => {
            gameBoard.appendChild(card);
        });
    }

    function createCard(content, pairId, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = pairId;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = '?';

        const back = document.createElement('div');
        back.className = 'card-back';
        
        if (type === 'letter') {
            const letter = document.createElement('div');
            letter.textContent = content;
            letter.style.fontSize = '3em';
            back.appendChild(letter);
        } else {
            const img = new Image();
            img.src = content;
            img.alt = `Image for ${content}`;
            back.appendChild(img);
        }

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (card.classList.contains('flipped') || 
            flippedCards.length === 2 || 
            card.classList.contains('matched')) return;

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
                matches++;
                card1.classList.add('matched');
                card2.classList.add('matched');
                if (matches === pairs.length) endGame();
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            flippedCards = [];
        }, 600);
    }

    function endGame() {
        clearInterval(timerId);
        setTimeout(() => {
            alert(`🏆 Game Over!\nTime: ${time}s\nMoves: ${moves}`);
            startButton.disabled = false;
        }, 500);
    }

    function initStats() {
        let statsDiv = document.getElementById('stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'stats';
            statsDiv.className = 'stats';
            document.querySelector('.container').insertBefore(statsDiv, gameBoard);
        }
        updateStats();
    }

    function updateStats() {
        document.getElementById('stats').textContent = `Moves: ${moves} | Time: ${time}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function preloadImages() {
        pairs.forEach(pair => {
            new Image().src = pair.image;
            new Image().src = pair.letter;
        });
    }

    function updateTimer() {
        time++;
        updateStats();
    }
});