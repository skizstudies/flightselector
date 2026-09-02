class FlightGame {
    constructor(passengers) {
        this.passengers = passengers;
        this.lives = 3;
        this.questionsLeft = 6;
        
        this.dashboard = document.getElementById('flight-dashboard');
        this.grid = document.getElementById('passenger-grid');
        this.turbBtn = document.getElementById('turbulence-btn');
        this.modal = document.getElementById('emergency-modal');
        this.selectedDisplay = document.getElementById('selected-passenger');
        
        this.init();
    }

    init() {
        this.renderGrid();
        this.bindEvents();
    }

    renderGrid() {
        this.grid.innerHTML = '';
        this.passengers.forEach(p => {
            const seat = document.createElement('div');
            seat.className = 'passenger-seat';
            seat.id = `seat-${p}`;
            seat.innerText = p;
            this.grid.appendChild(seat);
        });
    }

    bindEvents() {
        this.turbBtn.addEventListener('click', () => this.triggerTurbulence());
        
        document.getElementById('correct-btn').addEventListener('click', () => {
            this.resolveQuestion(true);
        });
        
        document.getElementById('wrong-btn').addEventListener('click', () => {
            this.resolveQuestion(false);
        });
    }

    triggerTurbulence() {
        if (this.questionsLeft <= 0 || this.lives <= 0) return;

        // Start animations
        this.dashboard.classList.add('turbulence-active');
        document.body.classList.add('turbulence-overlay');
        this.turbBtn.disabled = true;

        // Visual cycling of names
        let cycle = setInterval(() => {
            document.querySelectorAll('.passenger-seat').forEach(s => s.classList.remove('selected'));
            const randomP = this.passengers[Math.floor(Math.random() * this.passengers.length)];
            document.getElementById(`seat-${randomP}`).classList.add('selected');
        }, 100);

        // Stop turbulence after 3 seconds and select passenger
        setTimeout(() => {
            clearInterval(cycle);
            this.dashboard.classList.remove('turbulence-active');
            document.body.classList.remove('turbulence-overlay');
            
            const chosen = this.passengers[Math.floor(Math.random() * this.passengers.length)];
            document.querySelectorAll('.passenger-seat').forEach(s => s.classList.remove('selected'));
            document.getElementById(`seat-${chosen}`).classList.add('selected');
            
            this.showModal(chosen);
        }, 3000);
    }

    showModal(passenger) {
        setTimeout(() => {
            this.selectedDisplay.innerText = passenger;
            this.modal.classList.remove('hidden');
        }, 500);
    }

    resolveQuestion(isCorrect) {
        this.modal.classList.add('hidden');
        this.turbBtn.disabled = false;
        this.questionsLeft--;
        document.getElementById('questions-display').innerText = `Questions Left: ${this.questionsLeft}`;

        if (!isCorrect) {
            this.lives--;
            let hearts = "❤️".repeat(this.lives) + "🖤".repeat(3 - this.lives);
            document.getElementById('lives-display').innerText = `Lives: ${hearts}`;
            
            if (this.lives === 0) {
                alert("CRITICAL FAILURE. WE ARE GOING DOWN! (Game Over)");
            }
        }

        if (this.questionsLeft === 0 && this.lives > 0) {
            alert("CLEAR SKIES AHEAD! We have safely landed.");
        }
    }
}

const classRoster = [
    "Aicert", "Aldred", "Kate", "Czynon", "Vincent",
    "Susan", "Haidie", "Rejc", "Nicole", "Alwyn", "AJ", 
    "Cris", "Gadiel", "Jeily", "Cindy", "Mary", "Nicko",
    "Rheman", "Gab", "Mhalik", "Jyvhan", "Athena", "Jillian",
    "Francis", "Karl", "Rechel", "Iah", "Kurt", "Edmar"
];

// Boot up the system
const game = new FlightGame(classRoster);