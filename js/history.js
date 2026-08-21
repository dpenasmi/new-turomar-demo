document.addEventListener("DOMContentLoaded", () => {

  const historyVisual = document.getElementById("historyVisual");
  const historyToggle = document.getElementById("historyToggle");
  const historyTimeTitle = document.getElementById("historyTimeTitle");

  const historyPrev = document.getElementById("historyPrev");
  const historyNext = document.getElementById("historyNext");
  const historyCounter = document.getElementById("historyCounter");

  if (
    !historyVisual ||
    !historyToggle ||
    !historyTimeTitle ||
    !historyPrev ||
    !historyNext ||
    !historyCounter
    ) {
    return;
    }

  const eraCurrent = historyVisual.querySelector(".history-era-current");
  const eraPast = historyVisual.querySelector(".history-era-past");

    if (!eraCurrent || !eraPast) {
    return;
    }


  let activeEra = "2026";
  let currentIndex = 0;


  /* =========================================================
     OBTENER COLECCIÓN ACTIVA
  ========================================================= */

  function getActiveEra() {
    return activeEra === "2026" ? eraCurrent : eraPast;
  }


  /* =========================================================
     MOSTRAR FOTOGRAFÍA
  ========================================================= */

  function showSlide(index) {

    const activeCollection = getActiveEra();
    const slides = activeCollection.querySelectorAll(".history-slide");

    if (!slides.length) return;

    /* Carrusel circular */

    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }

    /* Ocultamos todas */

    slides.forEach(slide => {
      slide.classList.remove("is-active");
    });

    /* Mostramos la correspondiente */

    slides[currentIndex].classList.add("is-active");

    /* Actualizamos contador */

    historyCounter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }


  /* =========================================================
     FLECHA SIGUIENTE
  ========================================================= */

  historyNext.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });


  /* =========================================================
     FLECHA ANTERIOR
  ========================================================= */

  historyPrev.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });


  /* =========================================================
     CAMBIAR DE ÉPOCA
  ========================================================= */

  historyToggle.addEventListener("click", () => {

    const goingToPast = activeEra === "2026";

    /* Al cambiar de época volvemos a la foto 01 */

    currentIndex = 0;

    if (goingToPast) {

      activeEra = "1971";

      eraCurrent.classList.remove("is-active");
      eraPast.classList.add("is-active");

      historyVisual.classList.add("is-past");

      historyToggle.setAttribute("aria-pressed", "true");

      historyTimeTitle.textContent = "VUELVE AL PRESENTE";

    } else {

      activeEra = "2026";

      eraPast.classList.remove("is-active");
      eraCurrent.classList.add("is-active");

      historyVisual.classList.remove("is-past");

      historyToggle.setAttribute("aria-pressed", "false");

      historyTimeTitle.textContent = "VIAJE AL PASADO";
    }

    showSlide(0);
  });

    /* =========================================================
     SWIPE TÁCTIL
    ========================================================= */

    let swipeStartX = 0;
    let swipeStartY = 0;
    let isSwiping = false;

    const swipeThreshold = 45;

    /*
    * Permitimos el scroll vertical normal de la página,
    * pero dejamos libre el gesto horizontal para el carrusel.
    */
    historyVisual.style.touchAction = "pan-y";


    /* Inicio del gesto */

    historyVisual.addEventListener("pointerdown", (event) => {

        /*
        * No iniciamos swipe si el usuario está tocando
        * el switch, las flechas o cualquier botón del carrusel.
        */
        if (
        event.target.closest(".history-time-control") ||
        event.target.closest(".history-carousel-nav")
        ) {
        return;
        }

        /*
        * Solo nos interesa interacción táctil o con stylus.
        * Evitamos que arrastrar con el ratón cambie fotografías.
        */
        if (event.pointerType === "mouse") {
        return;
        }

        swipeStartX = event.clientX;
        swipeStartY = event.clientY;

        isSwiping = true;
    });


    /* Final del gesto */

    historyVisual.addEventListener("pointerup", (event) => {

        if (!isSwiping) return;

        const swipeEndX = event.clientX;
        const swipeEndY = event.clientY;

        const distanceX = swipeEndX - swipeStartX;
        const distanceY = swipeEndY - swipeStartY;

        isSwiping = false;


        /*
        * Si el movimiento vertical es mayor que el horizontal,
        * interpretamos que el usuario quería hacer scroll.
        */
        if (Math.abs(distanceY) >= Math.abs(distanceX)) {
        return;
        }


        /*
        * Evitamos que un pequeño movimiento accidental
        * cambie de fotografía.
        */
        if (Math.abs(distanceX) < swipeThreshold) {
        return;
        }


        /* Swipe hacia la izquierda → siguiente */

        if (distanceX < 0) {
        showSlide(currentIndex + 1);
        }


        /* Swipe hacia la derecha → anterior */

        else {
        showSlide(currentIndex - 1);
        }

    });


    /* Si el navegador cancela el gesto */

    historyVisual.addEventListener("pointercancel", () => {
        isSwiping = false;
    });


  /* =========================================================
     ESTADO INICIAL
  ========================================================= */

  showSlide(0);

});