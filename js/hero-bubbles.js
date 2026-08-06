// =========================
// Hero Bubbles
// 散氣盤向量圖的上升氣泡
//
// 產品的功能就是把空氣打散成 1–3 mm 的細氣泡，
// 主視覺直接畫這件事，而不是套一個通用的漸層裝飾。
//
// 純裝飾，不承載任何資訊，容器需標 aria-hidden。
// 對應標記：<div class="bubbles" id="heroBubbles"></div>
// =========================

const COUNT = 22;


export function initHeroBubbles(){

    const boxes =
        document.querySelectorAll(".bubbles");

    if(!boxes.length) return;

    const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced) return;

    boxes.forEach((box) => {

        // 散氣管是橫置的，氣泡沿整條管身冒出，鋪得比散氣盤寬
        const wide =
            box.closest(".tube-stage") !== null;

        for(let i = 0; i < COUNT; i++){

            box.appendChild(createBubble(wide));
        }
    });
}


function createBubble(wide){

    const bubble =
        document.createElement("span");

    bubble.className = "bubble";

    // 5–18 px，對應 1–3 mm 的視覺比例
    const size = 5 + Math.random() * 13;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    const start = wide ? 10 : 18;
    const span  = wide ? 80 : 64;

    bubble.style.left = `${start + Math.random() * span}%`;

    // 上升過程的左右偏移
    bubble.style.setProperty("--dx", `${Math.random() * 60 - 30}px`);

    bubble.style.animationDuration = `${4 + Math.random() * 4.5}s`;
    bubble.style.animationDelay = `${Math.random() * 6}s`;

    return bubble;
}
