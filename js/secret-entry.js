// =========================
// 後台隱藏入口
// 3 秒內連點頁尾版權文字 5 下 → 前往 /admin/
// 只是不顯眼的捷徑，真正的保護是後台的帳號密碼
// =========================

const REQUIRED_CLICKS = 5;
const TIME_WINDOW = 3000;

export function initSecretEntry(){

    let clicks = [];

    // footer 是動態載入的，用事件委派才不用管載入順序
    document.addEventListener("click", (event) => {

        if(!event.target.closest(".copyright span")) return;

        const now = Date.now();

        clicks = clicks
            .filter((time) => now - time < TIME_WINDOW)
            .concat(now);

        if(clicks.length >= REQUIRED_CLICKS){

            clicks = [];
            window.location.href = "/admin/";
        }
    });
}
