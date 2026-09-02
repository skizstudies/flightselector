class FlightGame {
    constructor(passengers) {
        this.passengers = passengers;
        this.lives = 3;
        this.questionsLeft = 6;

        this.audioBGM = document.getElementById('bgm');
        this.audioTurbulence = document.getElementById('sfx-turbulence');
        this.audioCorrect = document.getElementById('sfx-correct');
        this.audioWrong = document.getElementById('sfx-wrong');
        
        this.dashboard = document.getElementById('flight-dashboard');
        this.preFlight = document.getElementById('pre-flight');
        this.cabin = document.getElementById('cabin-rows');
        this.turbBtn = document.getElementById('turbulence-btn');
        this.modal = document.getElementById('emergency-modal');
        this.selectedDisplay = document.getElementById('selected-passenger');
        
        this.init();
    }

    init() {
        this.renderCabin();
        this.bindEvents();
    }

    renderCabin() {
        this.cabin.innerHTML = '';
        let passCopy = [...this.passengers];
        
        // Generate rows of 4 (2 seats, aisle, 2 seats)
        while(passCopy.length > 0) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            
            for(let i = 0; i < 4; i++) {
                if (i === 2) {
                    const aisle = document.createElement('div');
                    aisle.className = 'aisle';
                    rowDiv.appendChild(aisle);
                }
                
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                if(passCopy.length > 0) {
                    const p = passCopy.shift();
                    seatDiv.id = `seat-${p}`;
                    seatDiv.innerText = p;
                } else {
                    seatDiv.innerText = "EMPTY";
                    seatDiv.style.opacity = "0.5";
                }
                rowDiv.appendChild(seatDiv);
            }
            this.cabin.appendChild(rowDiv);
        }
    }

    bindEvents() {
        document.getElementById('start-flight-btn').addEventListener('click', () => {
            this.preFlight.classList.add('hidden');
            this.dashboard.classList.remove('hidden');
            this.audioBGM.volume = 0.4;
            this.audioBGM.play(); // Starts the ambient airplane noise
        });

        this.turbBtn.addEventListener('click', () => this.triggerTurbulence());
        
        document.getElementById('correct-btn').addEventListener('click', () => this.resolveQuestion(true));
        document.getElementById('wrong-btn').addEventListener('click', () => this.resolveQuestion(false));
    }

    triggerTurbulence() {
        if (this.questionsLeft <= 0 || this.lives <= 0) return;

        this.audioBGM.pause();
        this.audioTurbulence.currentTime = 0;
        this.audioTurbulence.play();

        this.dashboard.classList.add('turbulence-active');
        document.body.classList.add('turbulence-overlay');
        this.turbBtn.disabled = true;

        let cycle = setInterval(() => {
            document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
            const randomP = this.passengers[Math.floor(Math.random() * this.passengers.length)];
            const seatElement = document.getElementById(`seat-${randomP}`);
            if(seatElement) seatElement.classList.add('selected');
        }, 100);

        setTimeout(() => {
            clearInterval(cycle);
            this.dashboard.classList.remove('turbulence-active');
            document.body.classList.remove('turbulence-overlay');
            
            const chosen = this.passengers[Math.floor(Math.random() * this.passengers.length)];
            document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
            document.getElementById(`seat-${chosen}`).classList.add('selected');
            
            this.showModal(chosen);
        }, 4000); // 4 seconds of turbulence buildup
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
        
        this.audioTurbulence.pause();
        this.audioBGM.play(); // Resume ambient noise

        if (isCorrect) {
            this.audioCorrect.currentTime = 0;
            this.audioCorrect.play();
            this.questionsLeft--;
        } else {
            this.audioWrong.currentTime = 0;
            this.audioWrong.play();
            this.lives--;
            this.questionsLeft--;
            
            let hearts = "❤️".repeat(this.lives) + "🖤".repeat(3 - this.lives);
            document.getElementById('lives-display').innerText = `Lives: ${hearts}`;
            
            if (this.lives === 0) {
                setTimeout(() => alert("CRITICAL FAILURE. WE ARE GOING DOWN! (Game Over)"), 500);
            }
        }

        document.getElementById('questions-display').innerText = `Questions Left: ${this.questionsLeft}`;

        if (this.questionsLeft === 0 && this.lives > 0) {
            setTimeout(() => alert("CLEAR SKIES AHEAD! We have safely landed."), 500);
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

const game = new FlightGame(classRoster);