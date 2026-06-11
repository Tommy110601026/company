// =========================
// Scroll Top Button
// 點擊後回到頁面頂部
// =========================

export function initScrollTop(){

    const scrollTopBtn =
        document.getElementById("scrollTopBtn");

    if(!scrollTopBtn) return;

    window.addEventListener("scroll", () => {

        if(window.scrollY > 400){

            scrollTopBtn.classList.add("is-visible");

        }else{

            scrollTopBtn.classList.remove("is-visible");
        }
    });

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}