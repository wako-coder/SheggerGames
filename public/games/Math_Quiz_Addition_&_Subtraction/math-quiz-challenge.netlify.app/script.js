// Game variables
        let score = 0;
        let currentQuestionIndex = 0;
        let questions = [];
        let timer;
        let adTimer;
        let secondsLeft = 5;
        let gameMode = 'normal'; // 'normal' or 'timer'
        let questionTimer;
        let timeLeft = 10;

        // DOM elements
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const startScreen = document.getElementById('start-screen');
        const normalModeButton = document.getElementById('normal-mode');
        const timerModeButton = document.getElementById('timer-mode');
        const gameContainer = document.getElementById('game-container');
        const homeButton = document.getElementById('home-button');
        const timerContainer = document.getElementById('timer-container');
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const feedbackElement = document.getElementById('feedback');
        const scoreElement = document.getElementById('score');
        const currentQuestionElement = document.getElementById('current-question');
        const progressElement = document.getElementById('progress');
        const adScreenElement = document.getElementById('ad-screen');
        const adTimerElement = document.getElementById('ad-timer');
        const closeAdButton = document.getElementById('close-ad');
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const restartButton = document.getElementById('restart');

        // Simulate loading
        function simulateLoading() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                loadingProgress.style.width = `${Math.min(progress, 100)}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        startScreen.classList.remove('hidden');
                    }, 500);
                }
            }, 200);
        }

        // Generate 100 addition and subtraction questions
        function generateQuestions() {
            for (let i = 0; i < 100; i++) {
                const num1 = Math.floor(Math.random() * 50) + 1;
                const num2 = Math.floor(Math.random() * 50) + 1;
                
                if (Math.random() > 0.5) {
                    // Addition question
                    questions.push({
                        question: `${num1} + ${num2}`,
                        answer: num1 + num2,
                        options: generateOptions(num1 + num2)
                    });
                } else {
                    // Subtraction question (ensure result is positive)
                    const larger = Math.max(num1, num2);
                    const smaller = Math.min(num1, num2);
                    questions.push({
                        question: `${larger} - ${smaller}`,
                        answer: larger - smaller,
                        options: generateOptions(larger - smaller)
                    });
                }
            }
        }

        // Generate 4 options including the correct answer
        function generateOptions(correctAnswer) {
            const options = [correctAnswer];
            
            // Generate 3 unique wrong answers
            while (options.length < 4) {
                let wrongAnswer;
                const variation = Math.floor(Math.random() * 10) + 1;
                
                if (Math.random() > 0.5) {
                    wrongAnswer = correctAnswer + variation;
                } else {
                    wrongAnswer = Math.max(1, correctAnswer - variation);
                }
                
                if (!options.includes(wrongAnswer)) {
                    options.push(wrongAnswer);
                }
            }
            
            // Shuffle options
            return options.sort(() => Math.random() - 0.5);
        }

        // Start question timer (for Timer Challenge mode)
        function startQuestionTimer() {
            timeLeft = 10;
            updateTimerDisplay();
            
            if (questionTimer) {
                clearInterval(questionTimer);
            }
            
            questionTimer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(questionTimer);
                    timeUp();
                }
            }, 1000);
        }

        // Update timer display
        function updateTimerDisplay() {
            timerContainer.textContent = `Time: ${timeLeft}s`;
            timerContainer.style.color = timeLeft <= 3 ? 'var(--wrong)' : 'var(--timer)';
        }

        // Handle when time is up
        function timeUp() {
            const currentQuestion = questions[currentQuestionIndex];
            feedbackElement.textContent = `Time's up! The answer was ${currentQuestion.answer}`;
            feedbackElement.className = 'feedback wrong';
            
            // Disable options
            const optionButtons = document.querySelectorAll('.option');
            optionButtons.forEach(button => {
                button.style.pointerEvents = 'none';
                if (parseInt(button.textContent) === currentQuestion.answer) {
                    button.style.backgroundColor = 'var(--correct)';
                }
            });
            
            // Move to next question after delay
            currentQuestionIndex++;
            setTimeout(() => {
                if (currentQuestionIndex % 20 === 0 && currentQuestionIndex < questions.length) {
                    showAd();
                } else {
                    displayQuestion();
                }
            }, 1500);
        }

        // Display current question
        function displayQuestion() {
            if (currentQuestionIndex >= questions.length) {
                endGame();
                return;
            }
            
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            
            optionsElement.innerHTML = '';
            currentQuestion.options.forEach(option => {
                const button = document.createElement('div');
                button.classList.add('option');
                button.textContent = option;
                button.addEventListener('click', () => selectAnswer(option));
                optionsElement.appendChild(button);
            });
            
            currentQuestionElement.textContent = currentQuestionIndex + 1;
            progressElement.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
            
            // Clear feedback
            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback';
            
            // Handle timer mode
            if (gameMode === 'timer') {
                timerContainer.style.display = 'block';
                startQuestionTimer();
            } else {
                timerContainer.style.display = 'none';
            }
        }

        // Handle answer selection
        function selectAnswer(selectedOption) {
            // Clear timer if in timer mode
            if (gameMode === 'timer') {
                clearInterval(questionTimer);
            }
            
            const currentQuestion = questions[currentQuestionIndex];
            
            if (selectedOption === currentQuestion.answer) {
                // Correct answer
                score++;
                scoreElement.textContent = score;
                feedbackElement.textContent = 'Correct!';
                feedbackElement.className = 'feedback correct';
                
                // Highlight correct answer
                const optionButtons = document.querySelectorAll('.option');
                optionButtons.forEach(button => {
                    if (parseInt(button.textContent) === currentQuestion.answer) {
                        button.style.backgroundColor = 'var(--correct)';
                    }
                });
            } else {
                // Wrong answer
                score = Math.max(0, score - 1);
                scoreElement.textContent = score;
                feedbackElement.textContent = `Wrong! The correct answer was ${currentQuestion.answer}`;
                feedbackElement.className = 'feedback wrong';
                
                // Highlight correct and wrong answers
                const optionButtons = document.querySelectorAll('.option');
                optionButtons.forEach(button => {
                    const buttonValue = parseInt(button.textContent);
                    if (buttonValue === currentQuestion.answer) {
                        button.style.backgroundColor = 'var(--correct)';
                    } else if (buttonValue === selectedOption) {
                        button.style.backgroundColor = 'var(--wrong)';
                    }
                });
            }
            
            // Disable options after selection
            const optionButtons = document.querySelectorAll('.option');
            optionButtons.forEach(button => {
                button.style.pointerEvents = 'none';
            });
            
            // Move to next question after a short delay
            currentQuestionIndex++;
            
            setTimeout(() => {
                if (currentQuestionIndex % 20 === 0 && currentQuestionIndex < questions.length) {
                    showAd();
                } else {
                    displayQuestion();
                }
            }, 1500);
        }

        // Show ad screen
        function showAd() {
            secondsLeft = 5;
            adTimerElement.textContent = secondsLeft;
            adScreenElement.classList.add('active');
            closeAdButton.disabled = true;
            
            // Countdown timer
            adTimer = setInterval(() => {
                secondsLeft--;
                adTimerElement.textContent = secondsLeft;
                
                if (secondsLeft <= 0) {
                    clearInterval(adTimer);
                    closeAdButton.disabled = false;
                }
            }, 1000);
        }

        // Close ad screen
        function closeAd() {
            clearInterval(adTimer);
            adScreenElement.classList.remove('active');
            displayQuestion();
        }

        // End game
        function endGame() {
            finalScoreElement.textContent = score;
            gameOverElement.classList.add('active');
        }

        // Return to home screen
        function returnToHome() {
            // Clear any active timers
            if (questionTimer) clearInterval(questionTimer);
            if (adTimer) clearInterval(adTimer);
            
            // Reset game state
            score = 0;
            currentQuestionIndex = 0;
            questions = [];
            
            // Hide game container and show start screen
            gameContainer.classList.remove('active');
            startScreen.classList.remove('hidden');
            
            // Hide ad screen if active
            adScreenElement.classList.remove('active');
            
            // Hide game over screen if active
            gameOverElement.classList.remove('active');
        }

        // Start game in selected mode
        function startGame(mode) {
            gameMode = mode;
            startScreen.classList.add('hidden');
            gameContainer.classList.add('active');
            scoreElement.textContent = '0';
            generateQuestions();
            displayQuestion();
        }

        // Restart game
        function restartGame() {
            score = 0;
            currentQuestionIndex = 0;
            scoreElement.textContent = score;
            questions = [];
            generateQuestions();
            gameOverElement.classList.remove('active');
            displayQuestion();
        }

        // Event listeners
        closeAdButton.addEventListener('click', closeAd);
        normalModeButton.addEventListener('click', () => startGame('normal'));
        timerModeButton.addEventListener('click', () => startGame('timer'));
        homeButton.addEventListener('click', returnToHome);
        restartButton.addEventListener('click', restartGame);

        // Initialize game
        window.addEventListener('DOMContentLoaded', () => {
            simulateLoading();
        });