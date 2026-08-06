// =========================
// Seal Toggle
// 自密封膜片結構的剖面狀態切換
//
// 散氣盤最關鍵的技術差異是「停止供氣時膜片會自己閉合」，
// 這件事用文字說不如直接演給人看。
//
// 對應標記：
//   按鈕   .toggle-btn[data-seal-mode="on|off"]
//   膜片   #sealMembrane   （svg path，切換 d）
//   孔隙   #sealPores      （切換 opacity）
//   氣泡   #sealBubbles    （切換 opacity）
//   說明   #sealNote       （切換文字）
//
// 說明文字寫在 HTML 的 data-seal-note，
// 讓文案留在頁面裡，翻譯與改字都不必動 JS。
// =========================

const SHAPES = {
    on:  "M62 168 Q210 138 358 168",
    off: "M62 168 Q210 166 358 168"
};


export function initSealToggle(){

    const buttons =
        document.querySelectorAll(".toggle-btn");

    if(!buttons.length) return;

    const membrane = document.getElementById("sealMembrane");
    const pores    = document.getElementById("sealPores");
    const bubbles  = document.getElementById("sealBubbles");
    const note     = document.getElementById("sealNote");

    if(!membrane) return;

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const mode =
                button.dataset.sealMode;

            if(!SHAPES[mode]) return;

            buttons.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            membrane.setAttribute("d", SHAPES[mode]);

            const visible =
                mode === "on" ? "1" : "0";

            if(pores)   pores.style.opacity = visible;
            if(bubbles) bubbles.style.opacity = visible;

            if(note && button.dataset.sealNote){
                note.textContent = button.dataset.sealNote;
            }
        });
    });
}
