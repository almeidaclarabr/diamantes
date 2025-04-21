document.addEventListener('DOMContentLoaded', function() {
    // Get all elements we need to manipulate
    const stepElements = document.querySelectorAll('.step');
    const continueBtn = document.getElementById('continue-btn');
    const playerNickname = document.getElementById('player-nickname');
    const diamondAmount = document.getElementById('diamond-amount');
    const sharedBtn = document.getElementById('shared-btn');
    const progressBar = document.querySelector('.progress-bar');
    const resultNickname = document.getElementById('result-nickname');
    const resultDiamonds = document.getElementById('result-diamonds');
    const errorMessage = document.getElementById('nickname-error');
    const loadingElement = document.querySelector('.loading');
    
    // Step management
    let currentStep = 0;
    
    // Show the first step initially
    stepElements[currentStep].classList.add('active');
    updateProgressBar();
    
    // Event listener for the continue button
    continueBtn.addEventListener('click', function() {
        if (!validateStep()) return;
        
        // Show loading animation
        loadingElement.style.display = 'block';
        continueBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            loadingElement.style.display = 'none';
            continueBtn.disabled = false;
            
            // Move to next step
            stepElements[currentStep].classList.remove('active');
            currentStep++;
            stepElements[currentStep].classList.add('active');
            
            // Update progress and display user selections
            updateProgressBar();
            updateUserSelections();
        }, 1500);
    });
    
    // Event listener for the shared button
    sharedBtn.addEventListener('click', function() {
        // Show loading animation
        loadingElement.style.display = 'block';
        sharedBtn.disabled = true;
        
        // Simulate verification delay
        setTimeout(() => {
            loadingElement.style.display = 'none';
            sharedBtn.disabled = false;
            
            // Move to final step
            stepElements[currentStep].classList.remove('active');
            currentStep++;
            stepElements[currentStep].classList.add('active');
            
            // Update progress
            updateProgressBar();
            
            // Start the countdown
            startCountdown();
        }, 2000);
    });
    
    // Validate current step
    function validateStep() {
        // Only validate the first step (player info)
        if (currentStep === 0) {
            const userIdPattern = /^\d{6,12}$/;
            if (playerNickname.value.trim() === '') {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Please enter your User ID';
                playerNickname.focus();
                return false;
            } else if (!userIdPattern.test(playerNickname.value.trim())) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'User ID must be 6-12 digits';
                playerNickname.focus();
                return false;
            } else {
                errorMessage.style.display = 'none';
            }
        }
        return true;
    }
    
    // Update progress bar based on current step
    function updateProgressBar() {
        const progress = ((currentStep + 1) / stepElements.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Update user selections in the result step
    function updateUserSelections() {
        if (currentStep === 1) {
            // Update the share step with user info
            document.getElementById('share-nickname').textContent = playerNickname.value;
            document.getElementById('share-diamonds').textContent = diamondAmount.value;
        } else if (currentStep === 2) {
            // Update the result step with user info
            resultNickname.textContent = playerNickname.value;
            resultDiamonds.textContent = diamondAmount.value;
        }
    }
    
    // Start the countdown timer for the final step
    function startCountdown() {
        let hours = 23;
        let minutes = 59;
        let seconds = 59;
        
        const countdownInterval = setInterval(() => {
            document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
            
            seconds--;
            
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    
                    if (hours < 0) {
                        clearInterval(countdownInterval);
                    }
                }
            }
        }, 1000);
    }
    
    // Generate dynamic share links for WhatsApp
    function setupShareLinks() {
        const shareButtons = document.querySelectorAll('.share-button');
        let sharedCount = 0;
        
        // Initially disable the "I've Shared" button
        sharedBtn.disabled = true;
        
        shareButtons.forEach(button => {
            // Remove previous event listener to avoid duplicates
            
            // Directly set up the WhatsApp click handler
            button.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent the default link behavior
                
                const shareId = this.getAttribute('data-share-id');
                const shareStatus = document.getElementById(`share-status-${shareId}`);
                
                // Set up the share message
                const shareMessage = encodeURIComponent(`Hey! I just found this Free Fire Diamond Generator! Check it out: ${window.location.href}`);
                const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}`;
                
                // Show loading animation
                shareStatus.querySelector('.share-loading').style.display = 'inline-block';
                
                // Open WhatsApp in a new window
                window.open(whatsappUrl, '_blank');
                
                // Simulate verification delay
                setTimeout(() => {
                    // Hide loading and show success
                    shareStatus.querySelector('.share-loading').style.display = 'none';
                    
                    // Mark as shared
                    if (!this.classList.contains('shared')) {
                        this.classList.add('shared');
                        shareStatus.querySelector('.share-complete').style.display = 'inline-block';
                        sharedCount++;
                        
                        // Enable the "I've Shared" button when all 3 are shared
                        if (sharedCount >= 3) {
                            sharedBtn.disabled = false;
                        }
                    }
                }, 1500);
            });
        });
    }
    
    // Input field validation
    playerNickname.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
    
    // Setup share links
    setupShareLinks();
});
