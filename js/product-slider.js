// =========================
// Product Slider
// 產品圖片輪播
//
// 改用指示條而非左右箭頭：
// 這些照片沒有先後順序，箭頭會讓人以為要一張張翻；
// 指示條一眼看得出總共幾張、現在第幾張，也不會蓋住照片。
//
// 對應標記：
//   <div class="product-slider">
//     <div class="slider-container">
//       <img class="slider-image active"> ...
//     </div>
//     <div class="slider-nav"></div>          指示條由本模組產生
//     <div class="slider-caption">
//       <span class="slider-index">01</span> / 04
//     </div>
//   </div>
//
// 每組輪播都要包在各自的 .product-slider 裡，避免多組互相干擾。
// =========================

const INTERVAL_MS = 4000;


export function initSlider(){

    const sliders =
        document.querySelectorAll(".product-slider");

    if(!sliders.length) return;

    sliders.forEach(setupSlider);
}


function setupSlider(slider){

    const images =
        slider.querySelectorAll(".slider-image");

    if(!images.length) return;

    const nav =
        slider.querySelector(".slider-nav");

    const indexLabel =
        slider.querySelector(".slider-index");

    let current = 0;
    let timer = null;

    const dots = [];

    // 產生指示條
    if(nav){

        images.forEach((_, i) => {

            const dot =
                document.createElement("button");

            dot.type = "button";
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", `第 ${i + 1} 張產品照片`);

            dot.addEventListener("click", () => {
                show(i);
                restart();
            });

            nav.appendChild(dot);
            dots.push(dot);
        });
    }

    function show(index){

        current = index;

        images.forEach((image, i) => {
            image.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            dot.setAttribute("aria-current", i === index ? "true" : "false");
        });

        if(indexLabel){
            indexLabel.textContent = String(index + 1).padStart(2, "0");
        }
    }

    function next(){
        show((current + 1) % images.length);
    }

    function start(){

        // 只有一張就不需要自動輪播
        if(images.length < 2) return;

        timer = window.setInterval(next, INTERVAL_MS);
    }

    function restart(){
        window.clearInterval(timer);
        start();
    }

    // 滑鼠停留時暫停，避免使用者正在看時被切走
    slider.addEventListener("mouseenter", () => window.clearInterval(timer));
    slider.addEventListener("mouseleave", start);

    show(0);
    start();
}
