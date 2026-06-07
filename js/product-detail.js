// =========================
// Product Detail Accordion
// =========================

export function initProductDetail(){

    const items =
        document.querySelectorAll(".product-detail-item");

    if(!items.length){
        return;
    }

    items.forEach((item) => {

        const toggle =
            item.querySelector(".product-detail-toggle");

        if(!toggle){
            return;
        }

        toggle.addEventListener("click", () => {

            item.classList.toggle("active");

        });

    });

}