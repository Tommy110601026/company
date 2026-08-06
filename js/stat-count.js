// =========================
// Stat Count
// 數據帶的數字滾動
//
// 對應標記：
//   <span data-count="9.96" data-dec="2">0</span>
//   data-count 為最終值，data-dec 為小數位數（預設 0）
//
// 關閉動態偏好時直接顯示最終值，不做動畫。
// =========================

const DURATION_MS = 1400;


export function initStatCount(){

    const nums =
        document.querySelectorAll("[data-count]");

    if(!nums.length) return;

    const settle = (el) => {

        const target =
            parseFloat(el.dataset.count);

        const dec =
            Number(el.dataset.dec || 0);

        el.textContent = target.toFixed(dec);
    };

    const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced || !("IntersectionObserver" in window)){

        nums.forEach(settle);

        return;
    }

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(!entry.isIntersecting) return;

            run(entry.target);

            observer.unobserve(entry.target);
        });

    }, { threshold: 0.6 });

    nums.forEach(el => observer.observe(el));
}


function run(el){

    const target =
        parseFloat(el.dataset.count);

    const dec =
        Number(el.dataset.dec || 0);

    let start = null;

    const step = (timestamp) => {

        if(!start) start = timestamp;

        const progress =
            Math.min((timestamp - start) / DURATION_MS, 1);

        // easeOutCubic：起步快、收尾緩，讀起來像在「停下來」
        const eased =
            1 - Math.pow(1 - progress, 3);

        el.textContent = (target * eased).toFixed(dec);

        if(progress < 1){
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}
