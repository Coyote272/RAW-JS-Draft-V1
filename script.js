class RAWGame {
    constructor() {
        this.deck = this.createDeck();
        this.playerDeck = [];
        this.cpuDeck = [];
        this.roundCount = 0;
        this.setup();
    }

    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        let deck = [];
        for (let suit of suits) {
            for (let i = 0; i < ranks.length; i++) {
                deck.push({ rank: ranks[i], value: i + 2, suit });
            }
        }
        return deck.sort(() => Math.random() - 0.5); // Shuffle
    }

    setup() {
        this.playerDeck = this.deck.slice(0, 26);
        this.cpuDeck = this.deck.slice(26, 52);
    }

    playRound() {
        this.roundCount++;
        const isTrios = this.roundCount % 5 === 0; // TRIOS every 5th round
        const drawCount = isTrios ? 3 : 2;

        const pDraw = this.playerDeck.splice(0, drawCount);
        const cDraw = this.cpuDeck.splice(0, drawCount);

        // Check for duplicates (Instant Loss rule)
        const pHasDup = new Set(pDraw.map(c => c.rank)).size !== pDraw.length;
        const cHasDup = new Set(cDraw.map(c => c.rank)).size !== cDraw.length;

        let winner = null;
        if (pHasDup && !cHasDup) winner = 'cpu';
        else if (cHasDup && !pHasDup) winner = 'player';
        else if (pHasDup && cHasDup) winner = 'tie';
        else {
            // Standard comparison logic (sum of values)
            const pSum = pDraw.reduce((a, b) => a + b.value, 0);
            const cSum = cDraw.reduce((a, b) => a + b.value, 0);
            winner = pSum > cSum ? 'player' : (cSum > pSum ? 'cpu' : 'tie');
        }

        this.handleResult(winner, [...pDraw, ...cDraw]);
        this.triggerAnimation(winner);
    }

    handleResult(winner, pot) {
        if (winner === 'player') this.playerDeck.push(...pot);
        else if (winner === 'cpu') this.cpuDeck.push(...pot);
        // Add win/loss check here
    }

    triggerAnimation(winner) {
        const cardElements = document.querySelectorAll('.card-active');
        cardElements.forEach(el => {
            el.classList.add(winner === 'player' ? 'beat-right' : 'beat-left');
        });
        // Remove classes after animation
    }
}
