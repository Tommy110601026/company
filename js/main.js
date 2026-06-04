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


function getContactErrorMessage(error, isEnglish){

    const messages = {
        "Invalid email format": {
            zh: "請輸入正確的Email格式。",
            en: "Please enter a valid email address."
        },

        "Missing required fields": {
            zh: "請填寫Email、主旨與留言內容。",
            en: "Please fill in email, subject, and message."
        },

        "Input content is too long": {
            zh: "輸入內容過長，請縮短後再送出。",
            en: "The input content is too long. Please shorten it and try again."
        },

        "Too many requests. Please try again later.": {
            zh: "送出次數過多，請稍後再試。",
            en: "Too many requests. Please try again later."
        },

        "Method Not Allowed": {
            zh: "送出方式不正確，請重新整理頁面後再試。",
            en: "Invalid request method. Please refresh the page and try again."
        }
    };

    const fallback = {
        zh: "送出失敗，請稍後再試。",
        en: "Submission failed. Please try again later."
    };

    const selected =
    messages[error] || fallback;

    return isEnglish
    ? selected.en
    : selected.zh;
}

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

    const isEnglish =
    window.location.pathname.includes("/en/");

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const inquiryType =
            form.querySelector('[name="inquiryType"]').value;
            
            const company =
            form.querySelector('[name="company"]').value;
            
            const email =
            form.querySelector('[name="email"]').value;
            
            const subject =
            form.querySelector('[name="subject"]').value;
            
            const message =
            form.querySelector('[name="message"]').value;

 
        
            
            try{

                // =========================
                // 測試：確認有抓到資料
                // =========================
            
                console.log({
                    inquiryType,
                    company,
                    email,
                    subject,
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
                        inquiryType,
                        company,
                        email,
                        subject,
                        message
                    })
                });
            
                const result =
                await response.json();
            
                console.log(result);
            
                if(result.success){

                    alert(
                        isEnglish
                        ? "Inquiry submitted successfully!"
                        : "送出成功！"
                    );
                
                    form.reset();
                
                    modal.classList.remove("active");
                }
                
                else{
                
                    alert(
                        getContactErrorMessage(
                            result.error,
                            isEnglish
                        )
                    );
                }
              
            
            }
            catch(error){

                console.error(error);
            
                alert(
                    isEnglish
                    ? "System error. Please try again later."
                    : "系統錯誤，請稍後再試。"
                );
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

    else if(path.includes("disc-diffuser.html")){
        currentPage = "disc";
    }
    else if(path.includes("tube-diffuser.html")){
        currentPage = "tube";
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

