// =========================
// Products Dropdown
// =========================

export function initDropdown(){

    const dropdownBtn =
        document.querySelector(".dropdown-btn");

    const dropdownMenu =
        document.querySelector(".dropdown-menu");

    if(
        !dropdownBtn ||
        !dropdownMenu
    ){
        return;
    }

    dropdownBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            dropdownMenu
                .classList
                .toggle("active");

        }
    );

    dropdownMenu.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

        }
    );

    document.addEventListener(
        "click",
        () => {

            dropdownMenu
                .classList
                .remove("active");

        }
    );

}