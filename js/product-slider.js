// =========================
// Product Slider
// =========================

export function initSlider(){

    const sliders =
        document.querySelectorAll(".product-slider");

    if(!sliders.length) return;

    sliders.forEach((slider) => {

        const images =
            slider.querySelectorAll(".slider-image");

        const prevBtn =
            slider.querySelector(".prev-btn");

        const nextBtn =
            slider.querySelector(".next-btn");

        if(
            !images.length ||
            !prevBtn ||
            !nextBtn
        ){
            return;
        }

        let current = 0;
        let timer = null;

        function showSlide(index){

            images.forEach((img) => {
                img.classList.remove("active");
            });

            images[index].classList.add("active");

        }

        function nextSlide(){

            current++;

            if(current >= images.length){
                current = 0;
            }

            showSlide(current);

        }

        function prevSlide(){

            current--;

            if(current < 0){
                current = images.length - 1;
            }

            showSlide(current);

        }

        function startAutoPlay(){

            timer =
                setInterval(
                    nextSlide,
                    3000
                );

        }

        function resetAutoPlay(){

            clearInterval(timer);
            startAutoPlay();

        }

        nextBtn.addEventListener(
            "click",
            () => {

                nextSlide();
                resetAutoPlay();

            }
        );

        prevBtn.addEventListener(
            "click",
            () => {

                prevSlide();
                resetAutoPlay();

            }
        );

        showSlide(0);
        startAutoPlay();

    });

}