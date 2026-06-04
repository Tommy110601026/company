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

function showFormErrors(form, errors, isEnglish){

    const alertBox =
    form.querySelector(".form-alert");

    if(!alertBox) return;

    const alertTitle =
    alertBox.querySelector(".form-alert-title");

    const alertMessage =
    alertBox.querySelector(".form-alert-message");

    const alertList =
    alertBox.querySelector(".form-alert-list");

    if(alertTitle){

        alertTitle.textContent =
        isEnglish
        ? "⚠️ Please check the form"
        : "⚠️ 請確認表單內容";
    }

    if(alertMessage){

        alertMessage.textContent =
        isEnglish
        ? "Please fix the following issues:"
        : "以下欄位需要修正：";
    }

    if(alertList){

        alertList.innerHTML = "";

        errors.forEach((error) => {

            const li =
            document.createElement("li");

            li.textContent =
            error;

            alertList.appendChild(li);
        });
    }

    alertBox.classList.add("active");

    alertBox.scrollIntoView({
        behavior:"smooth",
        block:"center"
    });
}

function hideFormErrors(form){

    const alertBox =
    form.querySelector(".form-alert");

    if(!alertBox) return;

    alertBox.classList.remove("active");
}

function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    const messageInput =
    form.querySelector('[name="message"]');

    const messageCount =
        form.querySelector(".message-count");

    const messageHint =
        form.querySelector(".form-hint");

    if(messageInput && messageCount && messageHint){

        const maxLength = 3000;

        const updateMessageCount = () => {

            const currentLength =
                messageInput.value.length;

            messageCount.textContent =
                currentLength;

            messageHint.classList.remove(
                "warning",
                "error"
            );

            if(currentLength >= maxLength){

                messageHint.classList.add("error");
            }

            else if(currentLength >= maxLength * 0.9){

                messageHint.classList.add("warning");
            }
        };

        messageInput.addEventListener(
            "input",
            updateMessageCount
        );

        updateMessageCount();
    }

    const isEnglish =
    window.location.pathname.includes("/en/");

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


                   const errors = [];

                    const inquiryType =
                    form.querySelector("[name='inquiryType']")?.value.trim();

                    const company =
                    form.querySelector("[name='company']")?.value.trim();

                    const email =
                    form.querySelector("[name='email']")?.value.trim();

                    const subject =
                    form.querySelector("[name='subject']")?.value.trim();

                    const message =
                    form.querySelector("[name='message']")?.value.trim();

                    const website =
                    form.querySelector("[name='website']")?.value.trim();   

                    if(!inquiryType){

                        errors.push(
                            isEnglish
                            ? "Inquiry purpose is required"
                            : "詢問項目為必填"
                        );
                    }

                    if(!company){

                        errors.push(
                            isEnglish
                            ? "Company name is required"
                            : "公司名稱為必填"
                        );
                    }

                    if(!email){

                        errors.push(
                            isEnglish
                            ? "Email is required"
                            : "Email為必填"
                        );
                    }

                    else if(!isValidEmail(email)){

                        errors.push(
                            isEnglish
                            ? "Email format is invalid"
                            : "Email格式不正確"
                        );
                    }

                    if(!subject){

                        errors.push(
                            isEnglish
                            ? "Subject is required"
                            : "主旨為必填"
                        );
                    }

                    if(!message){

                        errors.push(
                            isEnglish
                            ? "Message is required"
                            : "留言內容為必填"
                        );
                    }

                    if(company && company.length > 100){

                        errors.push(
                            isEnglish
                            ? "Company name must be under 100 characters"
                            : "公司名稱最多100字"
                        );
                    }

                    if(subject && subject.length > 150){

                        errors.push(
                            isEnglish
                            ? "Subject must be under 150 characters"
                            : "主旨最多150字"
                        );
                    }

                    if(message && message.length > 3000){

                        errors.push(
                            isEnglish
                            ? "Message must be under 3000 characters"
                            : "留言內容最多3000字"
                        );
                    }

                    if(errors.length > 0){

                        showFormErrors(
                            form,
                            errors,
                            isEnglish
                        );

                        return;
                    }

                    hideFormErrors(form);
 
        
            
            try{

                // =========================
                // 測試：確認有抓到資料
                // =========================
            
                console.log({
                    inquiryType,
                    company,
                    email,
                    subject,
                    message,
                    website
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
                        message,
                        website
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
                
                    showFormErrors(
                        form,
                        [
                            getContactErrorMessage(
                                result.error,
                                isEnglish
                            )
                        ],
                        isEnglish
                    );
                }
              
            
            }
            catch(error){

                console.error(error);
            
               showFormErrors(
                    form,
                    [
                        isEnglish
                        ? "System error. Please try again later."
                        : "系統錯誤，請稍後再試。"
                    ],
                    isEnglish
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

