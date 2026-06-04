// =========================
// Contact Modal + Form
// =========================

function isEnglishPage(){

    return window
        .location
        .pathname
        .includes("/en/");

}

function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

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

    if(!alertBox){
        return;
    }

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

    alertBox
        .classList
        .add("active");

    alertBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}

function hideFormErrors(form){

    const alertBox =
        form.querySelector(".form-alert");

    if(!alertBox){
        return;
    }

    alertBox
        .classList
        .remove("active");

}

function getFieldValue(form, name){

    return form
        .querySelector(`[name="${name}"]`)
        ?.value
        .trim() || "";

}

function initMessageCounter(form){

    const messageInput =
        form.querySelector('[name="message"]');

    const messageCount =
        form.querySelector(".message-count");

    const messageHint =
        form.querySelector(".form-hint");

    if(
        !messageInput ||
        !messageCount ||
        !messageHint
    ){
        return;
    }

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

            messageHint
                .classList
                .add("error");

        }
        else if(currentLength >= maxLength * 0.9){

            messageHint
                .classList
                .add("warning");

        }

    };

    messageInput.addEventListener(
        "input",
        updateMessageCount
    );

    updateMessageCount();

}

function validateContactForm(form, isEnglish){

    const inquiryType =
        getFieldValue(form, "inquiryType");

    const company =
        getFieldValue(form, "company");

    const email =
        getFieldValue(form, "email");

    const subject =
        getFieldValue(form, "subject");

    const message =
        getFieldValue(form, "message");

    const website =
        getFieldValue(form, "website");

    const errors = [];

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

    if(
        company &&
        company.length > 100
    ){

        errors.push(
            isEnglish
                ? "Company name must be under 100 characters"
                : "公司名稱最多100字"
        );

    }

    if(
        subject &&
        subject.length > 150
    ){

        errors.push(
            isEnglish
                ? "Subject must be under 150 characters"
                : "主旨最多150字"
        );

    }

    if(
        message &&
        message.length > 3000
    ){

        errors.push(
            isEnglish
                ? "Message must be under 3000 characters"
                : "留言內容最多3000字"
        );

    }

    return {
        values: {
            inquiryType,
            company,
            email,
            subject,
            message,
            website
        },
        errors
    };

}

function openContactModal(modal){

    modal
        .classList
        .add("active");

}

function closeContactModal(modal){

    modal
        .classList
        .remove("active");

}

export function initContact(){

    const modal =
        document.querySelector(".inquiry-modal");

    const form =
        document.querySelector(".inquiry-form");

    if(!modal){
        return;
    }

    const openButtons =
        document.querySelectorAll(
            ".quote-btn, #openInquiryModal, #openInquiryModalHero"
        );

    const closeButtons =
        document.querySelectorAll(
            ".inquiry-close, .inquiry-overlay"
        );

    openButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openContactModal(modal);

            }
        );

    });

    closeButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                closeContactModal(modal);

            }
        );

    });

    document.addEventListener(
        "keydown",
        (event) => {

            if(event.key === "Escape"){

                closeContactModal(modal);

            }

        }
    );

    if(!form){
        return;
    }

    initMessageCounter(form);

    const isEnglish =
        isEnglishPage();

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const {
                values,
                errors
            } = validateContactForm(
                form,
                isEnglish
            );

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

                const response =
                    await fetch("/api/contact", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(values)
                    });

                const result =
                    await response.json();

                if(result.success){

                    alert(
                        isEnglish
                            ? "Inquiry submitted successfully!"
                            : "送出成功！"
                    );

                    form.reset();

                    initMessageCounter(form);

                    closeContactModal(modal);

                    return;

                }

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