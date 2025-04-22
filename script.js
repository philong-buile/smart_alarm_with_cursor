document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const switchTab = (tabId) => {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Sound Duration Controls
    const soundDuration = document.getElementById('sound-duration');
    const durationValue = document.getElementById('duration-value');
    const countdownSoundDuration = document.getElementById('countdown-sound-duration');
    const countdownDurationValue = document.getElementById('countdown-duration-value');

    const updateDurationDisplay = (slider, display) => {
        display.textContent = slider.value;
    };

    soundDuration.addEventListener('input', () => {
        updateDurationDisplay(soundDuration, durationValue);
    });

    countdownSoundDuration.addEventListener('input', () => {
        updateDurationDisplay(countdownSoundDuration, countdownDurationValue);
    });

    // Alarm Functionality
    const alarmTime = document.getElementById('alarm-time');
    const setAlarmBtn = document.getElementById('set-alarm');
    const stopAlarmBtn = document.getElementById('stop-alarm');
    const alarmStatus = document.getElementById('alarm-status');
    const alarmSound = document.getElementById('alarm-sound');
    
    let alarmInterval;
    let audioContext;
    let oscillator;
    let gainNode;
    let alarmTimeout;

    // Initialize audio context
    const initAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
        }
    };

    const playAlarm = (duration = 5) => {
        try {
            initAudioContext();
            
            oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            oscillator.start();

            // Stop the oscillator after the specified duration
            oscillator.stop(audioContext.currentTime + duration);
            
            if (alarmSound) {
                alarmSound.currentTime = 0;
                alarmSound.play().catch(error => {
                    console.warn('HTML5 Audio playback failed:', error);
                });

                // Stop the audio after the specified duration
                alarmTimeout = setTimeout(() => {
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                }, duration * 1000);
            }
            
            alarmStatus.textContent = 'ALARM! ALARM!';
        } catch (error) {
            console.error('Error playing alarm:', error);
            if (alarmSound) {
                alarmSound.currentTime = 0;
                alarmSound.play().catch(error => {
                    console.error('All audio playback methods failed:', error);
                });

                // Stop the audio after the specified duration
                alarmTimeout = setTimeout(() => {
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                }, duration * 1000);
            }
        }
    };

    const stopAlarm = () => {
        try {
            if (oscillator) {
                oscillator.stop();
                oscillator = null;
            }
            if (gainNode) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            }
        } catch (error) {
            console.error('Error stopping alarm:', error);
        }
        
        if (alarmSound) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }

        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }
    };

    setAlarmBtn.addEventListener('click', () => {
        const time = alarmTime.value;
        if (!time) {
            alert('Please select a time');
            return;
        }

        const [hours, minutes] = time.split(':');
        const now = new Date();
        const alarmDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );

        if (alarmDate < now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }

        const timeUntilAlarm = alarmDate - now;
        
        alarmStatus.textContent = `Alarm set for ${time}`;
        setAlarmBtn.disabled = true;
        stopAlarmBtn.disabled = false;

        alarmInterval = setTimeout(() => {
            playAlarm(parseInt(soundDuration.value));
        }, timeUntilAlarm);
    });

    stopAlarmBtn.addEventListener('click', () => {
        clearTimeout(alarmInterval);
        stopAlarm();
        alarmStatus.textContent = 'Alarm stopped';
        setAlarmBtn.disabled = false;
        stopAlarmBtn.disabled = true;
    });

    // Stopwatch Functionality
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startStopwatchBtn = document.getElementById('start-stopwatch');
    const pauseStopwatchBtn = document.getElementById('pause-stopwatch');
    const resetStopwatchBtn = document.getElementById('reset-stopwatch');
    const stopwatchStatus = document.getElementById('stopwatch-status');

    let stopwatchInterval;
    let stopwatchTime = 0;
    let isStopwatchRunning = false;

    const formatTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateStopwatchDisplay = () => {
        stopwatchDisplay.textContent = formatTime(stopwatchTime);
    };

    const startStopwatch = () => {
        if (!isStopwatchRunning) {
            isStopwatchRunning = true;
            startStopwatchBtn.disabled = true;
            pauseStopwatchBtn.disabled = false;
            resetStopwatchBtn.disabled = false;
            stopwatchStatus.textContent = 'Stopwatch running';

            const startTime = Date.now() - stopwatchTime;
            stopwatchInterval = setInterval(() => {
                stopwatchTime = Date.now() - startTime;
                updateStopwatchDisplay();
            }, 10);
        }
    };

    const pauseStopwatch = () => {
        if (isStopwatchRunning) {
            isStopwatchRunning = false;
            clearInterval(stopwatchInterval);
            startStopwatchBtn.disabled = false;
            pauseStopwatchBtn.disabled = true;
            stopwatchStatus.textContent = 'Stopwatch paused';
        }
    };

    const resetStopwatch = () => {
        isStopwatchRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        updateStopwatchDisplay();
        startStopwatchBtn.disabled = false;
        pauseStopwatchBtn.disabled = true;
        resetStopwatchBtn.disabled = true;
        stopwatchStatus.textContent = 'Stopwatch reset';
    };

    startStopwatchBtn.addEventListener('click', startStopwatch);
    pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
    resetStopwatchBtn.addEventListener('click', resetStopwatch);

    // Countdown Timer Functionality
    const countdownDisplay = document.getElementById('countdown-display');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    const startCountdownBtn = document.getElementById('start-countdown');
    const pauseCountdownBtn = document.getElementById('pause-countdown');
    const resetCountdownBtn = document.getElementById('reset-countdown');
    const countdownStatus = document.getElementById('countdown-status');

    let countdownInterval;
    let countdownTime = 0;
    let isCountdownRunning = false;

    const formatCountdownTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateCountdownDisplay = () => {
        countdownDisplay.textContent = formatCountdownTime(countdownTime);
    };

    const startCountdown = () => {
        if (!isCountdownRunning) {
            const minutes = parseInt(countdownMinutes.value) || 0;
            const seconds = parseInt(countdownSeconds.value) || 0;
            
            if (minutes === 0 && seconds === 0) {
                alert('Please set a time greater than 0');
                return;
            }

            countdownTime = minutes * 60 + seconds;
            isCountdownRunning = true;
            startCountdownBtn.disabled = true;
            pauseCountdownBtn.disabled = false;
            resetCountdownBtn.disabled = false;
            countdownMinutes.disabled = true;
            countdownSeconds.disabled = true;
            countdownStatus.textContent = 'Countdown running';

            countdownInterval = setInterval(() => {
                if (countdownTime > 0) {
                    countdownTime--;
                    updateCountdownDisplay();
                } else {
                    clearInterval(countdownInterval);
                    playAlarm(parseInt(countdownSoundDuration.value));
                    countdownStatus.textContent = 'Time\'s up!';
                    startCountdownBtn.disabled = false;
                    pauseCountdownBtn.disabled = true;
                    resetCountdownBtn.disabled = false;
                    countdownMinutes.disabled = false;
                    countdownSeconds.disabled = false;
                    isCountdownRunning = false;
                }
            }, 1000);
        }
    };

    const pauseCountdown = () => {
        if (isCountdownRunning) {
            isCountdownRunning = false;
            clearInterval(countdownInterval);
            startCountdownBtn.disabled = false;
            pauseCountdownBtn.disabled = true;
            countdownStatus.textContent = 'Countdown paused';
        }
    };

    const resetCountdown = () => {
        isCountdownRunning = false;
        clearInterval(countdownInterval);
        countdownTime = 0;
        updateCountdownDisplay();
        startCountdownBtn.disabled = false;
        pauseCountdownBtn.disabled = true;
        resetCountdownBtn.disabled = true;
        countdownMinutes.disabled = false;
        countdownSeconds.disabled = false;
        countdownMinutes.value = '';
        countdownSeconds.value = '';
        countdownStatus.textContent = 'Countdown reset';
    };

    startCountdownBtn.addEventListener('click', startCountdown);
    pauseCountdownBtn.addEventListener('click', pauseCountdown);
    resetCountdownBtn.addEventListener('click', resetCountdown);
}); 