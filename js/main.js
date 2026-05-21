console.log("main.js loaded");



// =========================
// 語系切換
// =========================

function initLanguage() {

    console.log("initLanguage started");

    let currentLang = "en";

    const langBtn =
    document.querySelector(".lang-btn");

    console.log("langBtn =", langBtn);


    function setLanguage(lang){

        currentLang = lang;

        document
        .querySelectorAll("[data-en]")
        .forEach(el => {

            el.textContent =
            lang === "en"
            ? el.dataset.en
            : el.dataset.zh;

        });

        // 語言按鈕文字
        if(langBtn){

            langBtn.textContent =
            lang === "en"
            ? "中文"
            : "EN";
        }
    }


    // 綁定點擊
    if(langBtn){

        console.log("binding lang click");

        langBtn.addEventListener(
            "click",
            () => {

                console.log("lang clicked");

                const nextLang =
                currentLang === "en"
                ? "zh"
                : "en";

                setLanguage(nextLang);
            }
        );
    }

    // 預設英文
    setLanguage("en");
}





// =========================
// Products Dropdown
// =========================

function initDropdown(){

    console.log("initDropdown");

    const dropdownBtn =
    document.querySelector(".dropdown-btn");

    const dropdownMenu =
    document.querySelector(".dropdown-menu");

    console.log(dropdownBtn);
    console.log(dropdownMenu);

    if(!dropdownBtn || !dropdownMenu)
    return;

    dropdownBtn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            console.log("dropdown clicked");

            dropdownMenu
            .classList
            .toggle("active");
        }
    );

    // 點其他地方關閉
    document.addEventListener(
        "click",
        (e) => {

            if(
                !dropdownBtn.contains(e.target)
                &&
                !dropdownMenu.contains(e.target)
            ){

                dropdownMenu
                .classList
                .remove("active");
            }
        }
    );
}





// =========================
// Contact Modal
// =========================

function initContact(){

    console.log("initContact");

    const openBtn =
    document.querySelector(".quote-btn");

    const modal =
        document.querySelector(".inquiry-modal");

        const closeBtn =
        document.querySelector(".inquiry-close");

    console.log(openBtn);
    console.log(modal);
    console.log(closeBtn);

    if(
        !openBtn ||
        !modal ||
        !closeBtn
    ) return;

    openBtn.addEventListener(
        "click",
        () => {

            console.log("contact clicked");

            modal.classList.add("active");
        }
    );

    closeBtn.addEventListener(
        "click",
        () => {

            modal.classList.remove("active");
        }
    );

    // 點背景關閉
    window.addEventListener(
        "click",
        (e) => {

            if(e.target === modal){

                modal.classList.remove("active");
            }
        }
    );
}





// =========================
// Mobile Menu
// =========================

function initMobileMenu(){

    console.log("initMobileMenu");

    const menuBtn =
    document.querySelector(".mobile-menu-btn");

    const mobileMenu =
    document.querySelector(".mobile-menu");

    const closeBtn =
    document.querySelector(".mobile-close-btn");

    const mobileLinks =
    document.querySelectorAll(".mobile-nav-link");

    console.log(menuBtn);
    console.log(mobileMenu);
    console.log(closeBtn);

    if(!menuBtn || !mobileMenu)
    return;


    // =========================
    // 開啟
    // =========================

    menuBtn.addEventListener(
        "click",
        () => {

            mobileMenu
            .classList
            .add("active");
        }
    );


    // =========================
    // 關閉
    // =========================

    closeBtn?.addEventListener(
        "click",
        () => {

            console.log("close clicked");

            mobileMenu
            .classList
            .remove("active");
        }
    );


    // 點選連結後自動關閉

    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu
                .classList
                .remove("active");
            }
        );
    });


    // =========================
    // Active 頁面判斷
    // =========================

    const path =
    window.location.pathname;

    console.log(path);

    let currentPage = "home";


    if(path.includes("about.html")){

        currentPage = "about";
    }

    else if(path.includes("download.html")){

        currentPage = "download";
    }

    else if(
        path.includes("disc-diffuser.html")
        ||
        path.includes("tube-diffuser.html")
    ){

        currentPage = "products";
    }


    console.log(currentPage);


    const activeLink =
    document.querySelector(
        `.mobile-nav-link[data-mobile-page="${currentPage}"]`
    );

    console.log(activeLink);

    activeLink?.classList.add("active");
}

function initActiveNav(){

    console.log("initActiveNav started");
console.log(window.location.pathname);

    const path =
    window.location.pathname;

    console.log(path);

    // Home
    if(path.includes("home.html")){

        const homeLink =
        document.querySelector('[data-page="home"]');

        console.log(homeLink);

        homeLink?.classList.add("active");
    }

    // About
    else if(path.includes("about.html")){

        document
        .querySelector('[data-page="about"]')
        ?.classList.add("active");
    }

    // Download
    else if(path.includes("download.html")){

        document
        .querySelector('[data-page="download"]')
        ?.classList.add("active");
    }

    // Products
    else if(
        path.includes("disc-diffuser.html")
        ||
        path.includes("tube-diffuser.html")
    ){

        document
        .querySelector('[data-page="products"]')
        ?.classList.add("active");
    }
}