document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const container = document.querySelector('.container');
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timerId = null;
    let matches = 0;

    // Letter-image pairs (update paths if needed)
    const pairs = [
        { id: 1, letter: 'A', image: 'images/apple.jpeg' },
        { id: 2, letter: 'B', image: 'images/ball.jpeg' },
        { id: 3, letter: 'C', image: 'images/cat.jpeg' },
        { id: 4, letter: 'D', image: 'images/dog.jpeg' },
        { id: 5, letter: 'E', image: 'images/egg.jpeg' },
        { id: 6, letter: 'F', image: 'images/fish.jpeg' }
    ];

    // Event Listeners
    startButton.addEventListener('click', startGame);

    function startGame() {
        // Reset game state
        startButton.disabled = true;
        gameBoard.innerHTML = '';
        flippedCards = [];
        moves = 0;
        time = 0;
        matches = 0;
        
        // Clear existing timer
        if (timerId) clearInterval(timerId);
        timerId = setInterval(updateTimer, 1000);

        // Initialize stats display
        initStats();
        
        // Preload images
        pairs.forEach(pair => preloadImage(pair.image));

        // Create and shuffle cards
        const cards = [];
        pairs.forEach(pair => {
            cards.push(createCardData(pair, 'letter'));
            cards.push(createCardData(pair, 'image'));
        });
        
        shuffleArray(cards).forEach(cardData => {
            gameBoard.appendChild(createCardElement(cardData));
        });
    }

    function createCardData(pair, type) {
        return {
            type: type,
            content: type === 'letter' ? pair.letter : pair.image,
            pairId: pair.id
        };
    }

    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = cardData.pairId;
        card.dataset.cardType = cardData.type;

        const front = document.createElement('div');
        front.className = `card-front ${cardData.type}`;
        
        if (cardData.type === 'letter') {
            front.textContent = cardData.content;
        } else {
            const img = document.createElement('img');
            img.src = cardData.content;
            img.alt = `Image for ${String.fromCharCode(64 + cardData.pairId)}`;
            front.appendChild(img);
        }

        const back = document.createElement('div');
        back.className = 'card-back';

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', () => handleCardClick(card));
        
        return card;
    }

    function handleCardClick(card) {
        if (canFlipCard(card)) {
            flipCard(card);
            checkForMatch();
        }
    }

    function canFlipCard(card) {
        return !card.classList.contains('flipped') &&
               !card.classList.contains('matched') &&
               flippedCards.length < 2;
    }

    function flipCard(card) {
        card.classList.add('flipped');
        flippedCards.push({
            element: card,
            pairId: card.dataset.pairId,
            type: card.dataset.cardType
        });
    }

    function checkForMatch() {
        if (flippedCards.length === 2) {
            moves++;
            updateStats();
            
            const [first, second] = flippedCards;
            const isMatch = first.pairId === second.pairId && first.type !== second.type;

            if (isMatch) handleMatchSuccess();
            else handleMatchFailure();
        }
    }

    function handleMatchSuccess() {
        flippedCards.forEach(card => {
            card.element.classList.add('matched');
            card.element.classList.remove('flipped');
        });
        matches++;
        flippedCards = [];

        if (matches === pairs.length) {
            clearInterval(timerId);
            setTimeout(() => {
                alert(`🎉 You won in ${time} seconds with ${moves} moves!`);
                startButton.disabled = false;
            }, 500);
        }
    }

    function handleMatchFailure() {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.element.classList.remove('flipped');
            });
            flippedCards = [];
        }, 1000);
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

    function updateTimer() {
        time++;
        updateStats();
    }
});