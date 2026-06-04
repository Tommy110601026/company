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

    menuBtn.addEventListener(
        "click",
        () => {

            mobileMenu
                .classList
                .add("active");

        }
    );

    closeBtn?.addEventListener(
        "click",
        () => {

            mobileMenu
                .classList
                .remove("active");

        }
    );

    mobileLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu
                    .classList
                    .remove("active");

            }
        );

    });

    mobileInquiryBtn?.addEventListener(
        "click",
        () => {

            mobileMenu
                .classList
                .remove("active");

            document
                .getElementById("openInquiryModal")
                ?.click();

        }
    );

}