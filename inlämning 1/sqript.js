// Objekt som representerar en spelare och dess egenskaper
const player = {
    name: "", // Spelarens namn
    totalScore: 0, // Totalt poäng som spelaren har
    roundScore: 0, // Poäng som spelaren har för den aktuella omgången
    rounds: 0, // Antal spelade omgångar

    // Återställ poängen för den aktuella omgången och öka antalet omgångar
    resetRound: function() {
        this.roundScore = 0; // Återställ poäng för den aktuella omgången
        this.rounds++; // Öka antalet omgångar
    },

    // Lägg till poäng från tärningen till den aktuella omgångens poäng
    addRoundScore: function(dice) {
        this.roundScore += dice; // Lägg till tärningens poäng
    },

    // Frys poängen för den aktuella omgången och lägg till den till det totala poänget
    holdScore: function() {
        this.totalScore += this.roundScore; // Lägg till roundScore till totalScore
        this.roundScore = 0; // Återställ roundScore
        this.rounds++; // Öka antalet omgångar
    },

    // Kontrollera om spelaren har vunnit (100 eller mer poäng)
    hasWon: function() {
        return this.totalScore >= 100; // Returnera om totalScore är större än eller lika med 100
    },

    // Återställ alla spelarens poäng och omgångar
    reset: function() {
        this.totalScore = 0; // Återställ totalScore
        this.roundScore = 0; // Återställ roundScore
        this.rounds = 0; // Återställ rounds
    }
};

// Objekt för att hantera användargränssnittet
const ui = {
    // Uppdatera visningen av spelarens data på sidan
    update: function() {
        document.getElementById("displayName").textContent = player.name;
        document.getElementById("totalScore").textContent = player.totalScore;
        document.getElementById("roundScore").textContent = player.roundScore;
        document.getElementById("rounds").textContent = player.rounds;
    },

    // Visa ett meddelande på sidan
    showMessage: function(msg) {
        document.getElementById("message").textContent = msg;
    },

    // Visa tärningens resultat på sidan
    showDice: function(dice) {
        const diceContainer = document.getElementById("dice");
        diceContainer.className = `die ${ui.getDiceClass(dice)}`; // Lägg till klass för att visa rätt tärning
        diceContainer.innerHTML = ui.getDiceDots(dice); // Lägg till dots baserat på tärningens resultat
        diceContainer.classList.remove("hidden"); // Visa tärningen
    },

    // Hämta rätt CSS-klass baserat på tärningens resultat
    getDiceClass: function(dice) {
        return ["one", "two", "three", "four", "five", "six"][dice - 1];
    },

    // Skapa HTML för att visa dots för tärningen (1-6)
    getDiceDots: function(dice) {
        let dots = "";
        for (let i = 0; i < dice; i++) {
            dots += "<div></div>"; // Lägg till en dot för varje poäng på tärningen
        }
        return dots;
    },

    // Visa spelet och dölja startskärmen
    showGame: function() {
        document.getElementById("start").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
    },

    // Dölja spelet och visa startskärmen
    hideGame: function() {
        document.getElementById("game").classList.add("hidden");
    },

    // Visa knappar för att starta om spelet eller gå tillbaka till startskärmen
    showRestartOption: function() {
        document.getElementById("restartGame").classList.remove("hidden");
        document.getElementById("backToStart").classList.remove("hidden");
    },

    // Dölja knappar för att starta om spelet eller gå tillbaka till startskärmen
    hideRestartOptions: function() {
        document.getElementById("restartGame").classList.add("hidden");
        document.getElementById("backToStart").classList.add("hidden");
    },

    // Visa knappen för att gå tillbaka till startskärmen
    showBackToStartButton: function() {
        document.getElementById("backToStart").classList.remove("hidden");
    },

    // Dölja knappen för att gå tillbaka till startskärmen
    hideBackToStartButton: function() {
        document.getElementById("backToStart").classList.add("hidden");
    }
};

// Objekt för att hantera spelets logik
const game = {
    // Starta spelet
    start: function() {
        const playerName = document.getElementById("playerName").value; // Hämta spelarens namn från input
        if (playerName.trim() === "") {
            alert("Skriv in ditt namn för att starta spelet."); // Visa alert om inget namn är inmatat
            return;
        }

        player.name = playerName; // Sätt spelarens namn
        ui.showGame(); // Visa spelet och dölja startskärmen
        ui.update(); // Uppdatera UI med spelarens data
        ui.hideRestartOptions();  // Döljer omstart-knappen när spelet börjar
    },

    // Slå tärningen och uppdatera resultatet
    rollDice: function() {
        const dice = Math.floor(Math.random() * 6) + 1; // Generera ett tärningsslag 
        ui.showDice(dice); // Visa tärningens resultat

        if (dice === 1) {
            player.resetRound(); // Återställ omgången om tärningen är 1
            ui.showMessage("Du slog en etta! Omgången avslutas."); // Visa meddelande
        } else {
            player.addRoundScore(dice); // Lägg till tärningens poäng till den aktuella omgången
            ui.showMessage(`Du slog en ${dice}. Fortsätt eller frys?`); // Visa meddelande
        }

        ui.update(); // Uppdatera UI med nya poäng
    },

    // Frysa poäng och gå vidare till nästa omgång
    holdScore: function() {
        player.holdScore(); 

        if (player.hasWon()) { // Kontrollera om spelaren har vunnit
            ui.showMessage(`Grattis ${player.name}! Du vann på ${player.rounds} omgångar!`); // Visa vinstmeddelande
            ui.showRestartOption();  // Visa omstart-knappen när spelet är slut
            return;
        }

        ui.showMessage("Poäng frysta! Dags för en ny omgång."); // Visa meddelande om nästa omgång
        ui.update(); // Uppdatera UI
    },

    // Starta om spelet
    restart: function() {
        player.reset(); // Återställ alla spelarens poäng och omgångar
        document.getElementById("dice").classList.add("hidden"); // Dölj tärningen vid omstart
        ui.update(); // Uppdatera UI
        ui.hideRestartOptions(); // Dölja omstartalternativen
        ui.showMessage("Spelet har startat om! Börja kasta tärningen."); // Visa meddelande om att spelet har startat om
    },

    // Gå tillbaka till startskärmen
    backToStart: function() {
        player.reset(); // Återställ spelarens poäng och omgångar
        ui.hideGame(); // Dölja spelet
        ui.hideRestartOptions(); // Dölja omstartalternativen
        document.getElementById("start").classList.remove("hidden"); // Visa startskärmen igen
        document.getElementById("playerName").value = ""; // Rensa namn-input
        ui.showMessage(""); // Ta bort meddelande
    },
};

// Kopplar knapparna till funktioner
document.getElementById("startGame").addEventListener("click", game.start); 
document.getElementById("rollDice").addEventListener("click", game.rollDice); 
document.getElementById("holdScore").addEventListener("click", game.holdScore); 
document.getElementById("restartGame").addEventListener("click", game.restart); 
document.getElementById("backToStart").addEventListener("click", game.backToStart); 
