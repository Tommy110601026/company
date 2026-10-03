// =========================
// Mobile Menu
// =========================

export function initMobileMenu(){

    const menuBtn =
        document.querySelector(".mobile-menu-btn");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const closeBtn =
        document.querySelector(".mobile-close-btn");

    const mobileLinks =
        document.querySelectorAll(".mobile-nav-link");

    const mobileInquiryBtn =
        document.getElementById("mobileInquiryBtn");

    if(
        !menuBtn ||
        !mobileMenu
    ){
        return;
    }

    // 選單只佔半邊，另一半蓋一層遮罩，點遮罩即可關閉
    const backdrop =
        document.createElement("div");

    backdrop.className =
        "mobile-menu-backdrop";

    mobileMenu.after(backdrop);

    const openMenu = () => {
        mobileMenu.classList.add("active");
        backdrop.classList.add("active");
    };

    const closeMenu = () => {
        mobileMenu.classList.remove("active");
        backdrop.classList.remove("active");
    };

    backdrop.addEventListener("click", closeMenu);

    menuBtn.addEventListener(
        "click",
        openMenu
    );

    closeBtn?.addEventListener(
        "click",
        closeMenu
    );

    mobileLinks.forEach((link) => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });

    mobileInquiryBtn?.addEventListener(
        "click",
        () => {

            closeMenu();

            document
                .getElementById("openInquiryModal")
                ?.click();

        }
    );

}