document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameBoard = document.getElementById('game-board');
    const container = document.querySelector('.container');
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timerId = null;
    let matches = 0;

    // Letter-image pairs
    const pairs = [
        { id: 1, letter: 'A', image: 'images/A.png' },
        { id: 2, letter: 'B', image: 'images/B.png' },
        { id: 3, letter: 'C', image: 'images/C.png' },
        { id: 4, letter: 'D', image: 'images/D.png' },
        { id: 5, letter: 'E', image: 'images/E.png' },
        { id: 6, letter: 'F', image: 'images/F.png' }
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

        // Create stats display
        let statsDiv = document.getElementById('stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'stats';
            statsDiv.className = 'stats';
            container.insertBefore(statsDiv, gameBoard);
        }
        updateStatsDisplay();

        // Preload images
        pairs.forEach(pair => preloadImage(pair.image));

        // Generate cards (letter + image for each pair)
        const cards = [];
        pairs.forEach(pair => {
            cards.push({ type: 'letter', content: pair.letter, pairId: pair.id });
            cards.push({ type: 'image', content: pair.image, pairId: pair.id });
        });
        
        shuffleArray(cards).forEach(cardData => {
            gameBoard.appendChild(createCard(cardData));
        });
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

    function createCard(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = cardData.pairId;
        card.dataset.cardType = cardData.type;

        const front = document.createElement('div');
        front.className = 'card-front';
        
        if (cardData.type === 'letter') {
            front.textContent = cardData.content;
        } else {
            const img = document.createElement('img');
            img.src = cardData.content;
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
        if (card.classList.contains('flipped') || 
            flippedCards.length === 2 || 
            card.classList.contains('matched')) return;

        card.classList.add('flipped');
        const pairId = card.dataset.pairId;
        const cardType = card.dataset.cardType;
        flippedCards.push({ card, pairId, cardType });

        if (flippedCards.length === 2) {
            moves++;
            updateStatsDisplay();
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.pairId === card2.pairId && card1.cardType !== card2.cardType;

        if (isMatch) {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            matches++;
            flippedCards = [];
            
            if (matches === pairs.length) {
                clearInterval(timerId);
                setTimeout(() => {
                    alert(`🎉 Congratulations! You won in ${time} seconds with ${moves} moves!`);
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function updateStatsDisplay() {
        const statsDiv = document.getElementById('stats');
        if (statsDiv) {
            statsDiv.textContent = `Moves: ${moves} | Time: ${time}`;
        }
    }

    function updateTimer() {
        time++;
        updateStatsDisplay();
    }
});