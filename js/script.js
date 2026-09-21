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
// CACHE DES IMAGES
// ==========================================

const imageCache = new Map();


function preloadImage(src) {

    // Image déjà en cours de chargement
    // ou déjà chargée
    if (imageCache.has(src)) {
        return imageCache.get(src);
    }

    const img = new Image();

    const promise = new Promise((resolve, reject) => {

        img.onload = async () => {

            // Attend que le navigateur ait décodé
            // l'image avant de la considérer prête.
            try {

                if (img.decode) {
                    await img.decode();
                }

            } catch (error) {}

            resolve(img);

        };


        img.onerror = () => {

            reject(
                new Error(`Impossible de charger ${src}`)
            );

        };

    });


    img.src = src;

    imageCache.set(src, promise);

    return promise;

}


// ==========================================
// PRÉCHARGEMENT
// ==========================================

// Première image : priorité
const firstImage = images[0];

preloadImage(firstImage)
    .then(() => {

        background.style.backgroundImage =
            `url("${firstImage}")`;

        background.classList.add("visible");

    })
    .catch(error => {

        console.error(error);

    });


// Les images suivantes sont préchargées
// après avoir lancé la première.
//
// On utilise requestIdleCallback quand disponible
// pour éviter de concurrencer le chargement initial.

function preloadRemainingImages() {

    images.slice(1).forEach(src => {

        preloadImage(src);

    });

}


if ("requestIdleCallback" in window) {

    requestIdleCallback(
        preloadRemainingImages
    );

} else {

    setTimeout(
        preloadRemainingImages,
        100
    );

}


// ==========================================
// AFFICHAGE IMAGE
// ==========================================

async function showImage(index) {

    const src = images[index];

    try {

        // Normalement cette Promise est déjà terminée
        // grâce au préchargement.
        await preloadImage(src);

        // L'image est maintenant prête :
        // changement immédiat.
        background.style.backgroundImage =
            `url("${src}")`;

        background.classList.add("visible");

    } catch (error) {

        console.error(
            "Impossible de charger l'image :",
            src,
            error
        );

    }

}


// ==========================================
// NEXT
// ==========================================

next.addEventListener("click", async () => {

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    await showImage(currentImage);

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


document.addEventListener(
    "mousemove",
    resetMouseTimer
);

document.addEventListener(
    "mousedown",
    resetMouseTimer
);

document.addEventListener(
    "touchstart",
    resetMouseTimer
);


// ==========================================
// INITIALISATION
// ==========================================

resetMouseTimer();
