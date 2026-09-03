// =========================================
// DAYA'S 22ND BIRTHDAY
// MICROPHONE-ENABLED CANDLE BLOWING
// =========================================

// -----------------------------------------
// DOM ELEMENTS
// -----------------------------------------

const startButton = document.getElementById("startBtn");
const birthdaySection = document.getElementById("birthdaySection");
const blowButton = document.getElementById("blowBtn");
const surpriseButton = document.getElementById("surpriseBtn");
const finalScreen = document.getElementById("finalScreen");
const closeButton = document.getElementById("closeBtn");
const musicButton = document.getElementById("musicBtn");
const birthdayMusic = document.getElementById("birthdayMusic");
const confettiContainer = document.getElementById("confettiContainer");

// -----------------------------------------
// OPEN BIRTHDAY CARD
// -----------------------------------------

startButton.addEventListener("click", () => {
    birthdaySection.classList.remove("hidden");

    birthdaySection.scrollIntoView({
        behavior: "smooth"
    });

    createConfetti(60);
});

// -----------------------------------------
// MICROPHONE-ENABLED CANDLE BLOWING
// -----------------------------------------

let candlesBlown = false;
let microphoneStarted = false;
let audioContext;
let analyser;
let microphoneSource;
let microphoneStream;
let microphoneAnimationFrame;

blowButton.addEventListener("click", async () => {
    if (candlesBlown || microphoneStarted) {
        return;
    }

    try {
        blowButton.textContent = "🎤 Listening... Blow!";

        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;

        microphoneSource = audioContext.createMediaStreamSource(
            microphoneStream
        );

        microphoneSource.connect(analyser);
        microphoneStarted = true;

        blowButton.textContent = "💨 Blow into your microphone!";
        detectBlow();
    } catch (error) {
        console.error("Unable to access the microphone:", error);

        blowButton.textContent = "🎤 Allow Microphone & Try Again";

        alert(
            "Microphone access is required.\n\n" +
            "Please select Allow when your browser requests microphone permission."
        );
    }
});

// -----------------------------------------
// BLOW DETECTION
// -----------------------------------------

function detectBlow() {
    if (!analyser || candlesBlown) {
        return;
    }

    const dataArray = new Uint8Array(analyser.fftSize);

    function checkVolume() {
        if (candlesBlown) {
            return;
        }

        analyser.getByteTimeDomainData(dataArray);

        let sumOfSquares = 0;

        for (let index = 0; index < dataArray.length; index++) {
            const normalizedValue = (dataArray[index] - 128) / 128;
            sumOfSquares += normalizedValue * normalizedValue;
        }

        const volume = Math.sqrt(sumOfSquares / dataArray.length);

        // Adjust this threshold to change blow-detection sensitivity.
        if (volume > 0.13) {
            extinguishCandles();
            return;
        }

        microphoneAnimationFrame = requestAnimationFrame(checkVolume);
    }

    checkVolume();
}

// -----------------------------------------
// EXTINGUISH CANDLES
// -----------------------------------------

function extinguishCandles() {
    if (candlesBlown) {
        return;
    }

    candlesBlown = true;

    cancelAnimationFrame(microphoneAnimationFrame);

    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
    }

    if (audioContext) {
        audioContext.close();
    }

    const candles = document.querySelectorAll(".candle");

    candles.forEach((candle, index) => {
        setTimeout(() => {
            candle.classList.add("off");
        }, index * 300);
    });

    setTimeout(() => {
        blowButton.textContent = "✨ Wish Made! ✨";
        blowButton.disabled = true;
        blowButton.classList.add("wish-made");
    }, 1000);

    setTimeout(() => {
        createConfetti(150);
    }, 900);
}

// -----------------------------------------
// FINAL SURPRISE
// -----------------------------------------

surpriseButton.addEventListener("click", () => {
    finalScreen.classList.add("show");

    createConfetti(180);
    createSparkles();
});

// -----------------------------------------
// CLOSE FINAL SCREEN
// -----------------------------------------

closeButton.addEventListener("click", () => {
    finalScreen.classList.remove("show");
});

// -----------------------------------------
// CONFETTI
// -----------------------------------------

function createConfetti(amount) {
    const colors = [
        "#ff6b9d",
        "#ffd166",
        "#c77dff",
        "#ffffff",
        "#ff9f1c",
        "#72ddf7"
    ];

    for (let index = 0; index < amount; index++) {
        const confettiPiece = document.createElement("div");

        confettiPiece.classList.add("confetti");
        confettiPiece.style.left = `${Math.random() * 100}vw`;
        confettiPiece.style.background =
            colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.animationDuration = `${Math.random() * 2 + 3}s`;
        confettiPiece.style.animationDelay = `${Math.random() * 0.8}s`;
        confettiPiece.style.width = `${Math.random() * 7 + 5}px`;
        confettiPiece.style.height = `${Math.random() * 10 + 6}px`;

        confettiContainer.appendChild(confettiPiece);

        setTimeout(() => {
            confettiPiece.remove();
        }, 5500);
    }
}

// -----------------------------------------
// SPARKLES
// -----------------------------------------

function createSparkles() {
    for (let index = 0; index < 35; index++) {
        const sparkle = document.createElement("div");

        sparkle.textContent = "✦";
        sparkle.style.position = "fixed";
        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;
        sparkle.style.fontSize = `${Math.random() * 18 + 10}px`;
        sparkle.style.color = "#ffffff";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "900";
        sparkle.style.animation = "sparkleAnimation 2s ease forwards";

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 2200);
    }
}

// -----------------------------------------
// SPARKLE ANIMATION
// -----------------------------------------

const sparkleStyle = document.createElement("style");

sparkleStyle.textContent = `
@keyframes sparkleAnimation {
    0% {
        opacity: 0;
        transform: scale(0);
    }

    40% {
        opacity: 1;
        transform: scale(1.4);
    }

    100% {
        opacity: 0;
        transform: scale(0.3);
    }
}
`;

document.head.appendChild(sparkleStyle);

// -----------------------------------------
// MUSIC CONTROLS
// -----------------------------------------

let musicPlaying = false;

musicButton.addEventListener("click", () => {
    if (!musicPlaying) {
        birthdayMusic
            .play()
            .then(() => {
                musicPlaying = true;
                musicButton.textContent = "🔊";
            })
            .catch(() => {
                alert(
                    "Please place a file named birthday.mp3 in the birthday-card folder."
                );
            });

        return;
    }

    birthdayMusic.pause();
    musicPlaying = false;
    musicButton.textContent = "♫";
});