// =========================
// Motion
// 捲動進場動畫、header 捲動狀態、捲動進度條
//
// 進場動畫的隱藏規則寫在 global.css 的 .js-motion 底下。
// 這個 class 由本模組在最早的時機掛上 <html>，
// 因此關閉 JS 時內容會完整顯示，不影響 SEO 與無障礙。
// =========================

const REVEAL_SELECTOR = [
    ".hero-grid > div",
    ".section-head",
    ".stat",
    ".feat",
    ".flat-feature-card",
    ".struct-item",
    ".spec-shots",
    ".spec-tabs",
    ".cutaway",
    ".feature-tag",
    ".supply-item",
    ".why-card",
    ".feature-card",
    ".info-card",
    ".intro-card",
    ".download-item",
    ".product-tab-item",
    ".product-tab-card",
    ".product-visual-panel"
].join(", ");

const STAGGER_MS = 60;
const STAGGER_MAX = 300;


export function initMotion(){

    document
        .documentElement
        .classList
        .add("js-motion");

    initHeaderState();
    initReveal();
}


// =========================
// header 捲動狀態 + 進度條
// =========================

function initHeaderState(){

    const header =
        document.querySelector("header");

    if(!header) return;

    const bar =
        document.createElement("div");

    bar.className = "scroll-progress";

    header.appendChild(bar);

    let ticking = false;

    const update = () => {

        const max =
            document.documentElement.scrollHeight - window.innerHeight;

        const ratio =
            max > 0
                ? Math.min(window.scrollY / max, 1)
                : 0;

        bar.style.transform = `scaleX(${ratio})`;

        header.classList.toggle("is-stuck", window.scrollY > 40);

        ticking = false;
    };

    window.addEventListener("scroll", () => {

        if(ticking) return;

        ticking = true;

        window.requestAnimationFrame(update);

    }, { passive: true });

    window.addEventListener("resize", update);

    update();
}


// =========================
// 捲動進場
// =========================

function initReveal(){

    const targets =
        document.querySelectorAll(REVEAL_SELECTOR);

    if(!targets.length) return;

    const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 使用者關閉動態、或瀏覽器不支援時直接顯示
    if(reduced || !("IntersectionObserver" in window)){

        targets.forEach(el => el.classList.add("is-in"));

        return;
    }

    // 依同一個父層分組，讓相鄰元素依序進場
    const order = new Map();
    const counts = new Map();

    targets.forEach(el => {

        const parent = el.parentElement;
        const index = counts.get(parent) || 0;

        order.set(el, index);
        counts.set(parent, index + 1);
    });

    let observerFired = false;

    const observer = new IntersectionObserver((entries) => {

        observerFired = true;

        entries.forEach(entry => {

            if(!entry.isIntersecting) return;

            const el = entry.target;

            const delay =
                Math.min(order.get(el) * STAGGER_MS, STAGGER_MAX);

            el.style.transitionDelay = `${delay}ms`;

            el.classList.add("is-in");

            observer.unobserve(el);
        });

    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
    });

    targets.forEach(el => observer.observe(el));

    // 保險：觀察器若完全沒觸發過，2 秒後強制顯示，避免內容看不到
    window.setTimeout(() => {

        if(observerFired) return;

        targets.forEach(el => el.classList.add("is-in"));

    }, 2000);
}
