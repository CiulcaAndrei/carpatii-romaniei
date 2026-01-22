// Funcția pentru meniul mobil
function myFunction() {
    const nav = document.getElementById("myTopnav");
    if (!nav) {
        console.error('Navigation element not found');
        return;
    }
    
    // Toggle responsive class
    nav.classList.toggle("responsive");
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!nav.contains(e.target)) {
            nav.classList.remove("responsive");
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing website functionality');
    
    // Navigation functionality
    const nav = document.querySelector('.topnav');
    if (nav) {
        let lastScrollTop = 0;
        let isScrolling = false;
        
        // Handle scroll events with throttling
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    const scrollTop = window.pageYOffset;
                    
                    // Close menu on scroll
                    if (nav.classList.contains("responsive")) {
                        nav.classList.remove("responsive");
                    }
                    
                    // Hide/show menu based on scroll direction
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        nav.classList.add('nav-collapsed');
                    } else {
                        nav.classList.remove('nav-collapsed');
                    }
                    
                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove("responsive");
            }
        });
    }

    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Image modal functionality
    const modal = document.getElementById("imageModal");
    if (modal) {
        // Close modal with Escape key
        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
            }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});

// Image modal functions
function openModal(element) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    
    if (!modal || !modalImg || !modalCaption) {
        console.error('Modal elements not found');
        return;
    }
    
    modal.style.display = "block";
    modalImg.src = element.querySelector('img').src;
    modalCaption.innerHTML = element.querySelector('.gallery-caption').innerHTML;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    const modal = document.getElementById("imageModal");
    if (!modal) return;
    
    if (event.target.className === 'modal' || event.target.className === 'close-modal') {
        modal.style.display = "none";
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Test functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing test functionality');
    
    const quizForm = document.getElementById('quiz-form');
    const resultContainer = document.getElementById('result');
    const scoreDisplay = document.getElementById('score');
    const feedbackDisplay = document.getElementById('feedback');
    const timeDisplay = document.getElementById('time');

    // Only initialize test if we're on the test page
    if (!quizForm || !resultContainer || !scoreDisplay || !feedbackDisplay || !timeDisplay) {
        console.log('Not on test page, skipping test initialization');
        return;
    }

    console.log('Test page detected, initializing test functionality');

    // Răspunsurile corecte
    const correctAnswers = {
        q1: 'a', // 1849 m în Munții Bihor
        q2: 'a', // Grupele Carpaților Orientali
        q3: 'a', // Caracteristica Carpaților Meridionali
        q4: 'a', // Limita vestică a Carpaților Orientali
        q5: 'a', // 51% din Carpați în România
        q6: 'a', // 2544 m în Munții Făgăraș
        q7: 'a', // Flișul - complex de roci sedimentare
        q8: 'a', // Limita estică a Carpaților Orientali
        q9: 'b', // Lacul Bâlea
        q10: 'b', // Relief carstic în Apuseni
        q11: 'a', // Peleaga în Retezat
        q12: 'a'  // Cheile Turzii în Apuseni
    };

    let timerInterval = null;

    function startTimer() {
        console.log('Starting test timer');
        let timeLeft = 600; // 10 minute în secunde
        
        // Update timer immediately
        updateTimerDisplay(timeLeft);
        
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                console.log('Time up, submitting test');
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    function updateTimerDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const displayText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeDisplay.textContent = displayText;
    }

    function submitTest() {
        console.log('Submitting test...');
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        let score = 0;
        let feedback = '';

        // Check each answer
        for (let question in correctAnswers) {
            const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
            
            if (selectedAnswer) {
                if (selectedAnswer.value === correctAnswers[question]) {
                    score++;
                    feedback += `<p class="correct">✓ Întrebarea ${question.slice(1)}: Corect!</p>`;
                } else {
                    feedback += `<p class="incorrect">✗ Întrebarea ${question.slice(1)}: Incorect</p>`;
                }
            } else {
                feedback += `<p class="incorrect">✗ Întrebarea ${question.slice(1)}: Fără răspuns</p>`;
            }
        }

        // Display results
        scoreDisplay.textContent = score;
        feedbackDisplay.innerHTML = feedback;
        resultContainer.classList.add('show');

        // Disable form
        const inputs = quizForm.getElementsByTagName('input');
        for (let input of inputs) {
            input.disabled = true;
        }
        quizForm.querySelector('button').disabled = true;

        // Save result to localStorage
        try {
            const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
            testResults.push({
                date: new Date().toISOString(),
                score: score,
                totalQuestions: Object.keys(correctAnswers).length
            });
            localStorage.setItem('testResults', JSON.stringify(testResults));
        } catch (e) {
            console.error('Error saving test results:', e);
        }
    }

    // Form submit handler
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitTest();
    });

    // Start timer
    startTimer();
});

// Registration functionality
function toggleRegisterDropdown() {
    const dropdown = document.getElementById('registerDropdown');
    if (!dropdown) return;
    
    dropdown.classList.toggle('show');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        const registerIcon = document.querySelector('.register-icon');
        if (!registerIcon?.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    
    if (!email || !password) {
        alert('Vă rugăm completați toate câmpurile!');
        return;
    }

    if (password === '0000') {
        try {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            const registerButton = document.getElementById('floatingRegister');
            if (registerButton) {
                registerButton.style.display = 'none';
            }
            alert('Autentificare reușită!');
        } catch (e) {
            console.error('Error saving login state:', e);
            alert('A apărut o eroare la autentificare. Vă rugăm încercați din nou.');
        }
    } else {
        alert('Parolă incorectă! Parola implicită este: 0000');
    }
}

// Check login state on page load
window.addEventListener('load', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const registerButton = document.getElementById('floatingRegister');
        if (registerButton) {
            registerButton.style.display = 'none';
        }
    }
}); 