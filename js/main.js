console.log("main.js loaded");


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

    // 表單送出

    const form =
    document.querySelector(".inquiry-form");

    if(!form) return;

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const company =
            form.querySelector(
                'input[type="text"]'
            ).value;
            
            const email =
            form.querySelector(
                'input[type="email"]'
            ).value;
            
            const message =
            form.querySelector(
                'textarea'
            ).value;
            
            const inquiryType =
            form.querySelector(
                'select'
            ).value;
            
            try{

                // =========================
                // 測試：確認有抓到資料
                // =========================
            
                console.log({
                    inquiryType,
                    company,
                    email,
                    message
                });
            
            
            
                // =========================
                // API 測試（之後部署到 Vercel 再打開）
                // =========================
            
                
                const response =
                await fetch('/api/contact',{
            
                    method:'POST',
            
                    headers:{
                        'Content-Type':'application/json'
                    },
            
                    body:JSON.stringify({
            
                        company,
                        email,
                        message
                    })
                });
            
                const result =
                await response.json();
            
                console.log(result);
            
                if(result.success){
            
                    alert("送出成功！");
            
                    form.reset();
            
                    modal.classList.remove("active");
                }
            
                else{
            
                    alert("送出失敗");
                }
              
            
            }
            catch(error){
            
                console.error(error);
            
                alert("系統錯誤");
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

    if(
        path === "/"
        ||
        path.includes("index.html")
    ){
    
        currentPage = "home";
    }


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

    const mobileInquiryBtn =
document.getElementById("mobileInquiryBtn");

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

function initActiveNav(){

    console.log("initActiveNav started");
console.log(window.location.pathname);

    const path =
    window.location.pathname;

    console.log(path);

// Home
if(

    path === "/"
    ||

    path.includes("index.html")

){

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

