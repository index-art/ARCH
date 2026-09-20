const background = document.getElementById("background");

const next = document.getElementById("next");

const fullscreen = document.getElementById("fullscreen");

const controls = document.querySelector(".controls");


// ==========================================
// IMAGES
// ==========================================

const images = [
    "audio/night-1.webp",
    "audio/night-2.webp"
];

let currentImage = 0;


// ==========================================
// PRECHARGEMENT DES IMAGES
// ==========================================

const imageCache = new Map();


function preloadImage(src) {

    if (imageCache.has(src)) {
        return imageCache.get(src);
    }

    const img = new Image();

    const promise = new Promise((resolve, reject) => {

        img.onload = async () => {

            try {

                if (img.decode) {
                    await img.decode();
                }

            } catch (error) {}

            resolve(img);

        };

        img.onerror = reject;

    });

    img.src = src;

    imageCache.set(src, promise);

    return promise;

}


images.forEach(src => {

    preloadImage(src);

});


// ==========================================
// AFFICHAGE IMAGE
// ==========================================

function showImage(index) {

    const src = images[index];

    preloadImage(src).then(() => {

        background.style.backgroundImage =
            `url("${src}")`;

        background.classList.add("visible");

    }).catch(error => {

        console.error(
            "Impossible de charger l'image :",
            src
        );

    });

}


showImage(currentImage);


// ==========================================
// NEXT
// ==========================================

next.addEventListener("click", () => {

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    showImage(currentImage);

});


// ==========================================
// FULLSCREEN
// ==========================================

fullscreen.addEventListener("click", async () => {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error(
            "Impossible d'activer le plein écran :",
            error
        );

    }

});


// ==========================================
// SOURIS IMMOBILE
// ==========================================

let mouseTimer;

const mouseIdleDelay = 2500;


function showControls() {

    controls.classList.remove("hidden");

    document.body.classList.remove("cursor-hidden");

}


function hideControls() {

    controls.classList.add("hidden");

    document.body.classList.add("cursor-hidden");

}


function resetMouseTimer() {

    showControls();

    clearTimeout(mouseTimer);

    mouseTimer = setTimeout(() => {

        hideControls();

    }, mouseIdleDelay);

}


document.addEventListener("mousemove", resetMouseTimer);

document.addEventListener("mousedown", resetMouseTimer);

document.addEventListener("touchstart", resetMouseTimer);


// ==========================================
// INITIALISATION
// ==========================================

resetMouseTimer();