console.log("main.js loaded");
// ========================
// Language Switch
// ========================

const langBtn =
document.getElementById(
"langBtn"
);

const translatableElements =
document.querySelectorAll(
"[data-en][data-zh]"
);

let currentLang =
localStorage.getItem(
"language"
) || "en";

function applyLanguage(lang){

    translatableElements.forEach(
    (el) => {

        el.textContent =
        el.dataset[lang];

    });

    document.documentElement.lang =
    lang === "zh"
    ? "zh-Hant"
    : "en";

    langBtn.textContent =
    lang === "zh"
    ? "EN"
    : "中";
}

applyLanguage(currentLang);

langBtn.addEventListener(
"click",
() => {

    currentLang =
    currentLang === "zh"
    ? "en"
    : "zh";

    localStorage.setItem(
        "language",
        currentLang
    );

    applyLanguage(currentLang);

});


// ========================
// Inquiry Modal
// ========================

const inquiryModal =
document.getElementById(
"inquiryModal"
);

const openInquiryModal =
document.getElementById(
"openInquiryModal"
);

const closeInquiryModal =
document.getElementById(
"closeInquiryModal"
);

const closeInquiryBtn =
document.getElementById(
"closeInquiryBtn"
);

openInquiryModal.addEventListener(
"click",
() => {

    inquiryModal.classList.add(
    "active"
    );

});

closeInquiryModal.addEventListener(
"click",
() => {

    inquiryModal.classList.remove(
    "active"
    );

});

closeInquiryBtn.addEventListener(
"click",
() => {

    inquiryModal.classList.remove(
    "active"
    );

});

// ========================
// Product Dropdown
// ========================

console.log("Dropdown script start");

const productDropdownBtn =
document.getElementById(
"productDropdownBtn"
);

const productDropdownMenu =
document.getElementById(
"productDropdownMenu"
);

console.log(
"Button:",
productDropdownBtn
);

console.log(
"Menu:",
productDropdownMenu
);

if(
    productDropdownBtn &&
    productDropdownMenu
){

    console.log("Dropdown elements found");

    productDropdownBtn.addEventListener(
    "click",
    (e) => {

        console.log("BUTTON CLICKED");

        e.stopPropagation();

        productDropdownMenu.classList.toggle(
        "active"
        );

        console.log(
            "Menu class:",
            productDropdownMenu.className
        );

    });

    document.addEventListener(
    "click",
    (e) => {

        console.log("DOCUMENT CLICK");

        if(
            !productDropdownBtn.contains(e.target) &&
            !productDropdownMenu.contains(e.target)
        ){

            console.log("CLICK OUTSIDE");

            productDropdownMenu.classList.remove(
            "active"
            );

        }

    });

}else{

    console.log(
    "Dropdown elements NOT found"
    );

}