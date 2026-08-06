// =========================
// Active Navigation
// 標記目前所在的頁面
//
// 三個地方要標：
//   1. 桌機主導覽        .nav-links > a / .dropdown-btn  （data-page）
//   2. 桌機產品下拉選單   .dropdown-menu a               （data-page）
//   3. 手機選單          .mobile-nav-link               （data-mobile-page）
//
// 散氣盤與散氣管都歸在「產品」底下，
// 所以主導覽亮的是「產品」，下拉選單裡再標出實際是哪一支。
// =========================

function getCurrentPage(){

    const path =
        window.location.pathname;

    if(
        path === "/" ||
        path.endsWith("/zh/") ||
        path.endsWith("/en/") ||
        path.includes("index.html")
    ){
        return "home";
    }

    if(path.includes("about.html")){
        return "about";
    }

    if(path.includes("download.html")){
        return "download";
    }

    if(path.includes("disc-diffuser")){
        return "disc";
    }

    if(path.includes("tube-diffuser")){
        return "tube";
    }

    return "home";
}


function mark(element){

    if(!element) return;

    element.classList.add("active");
    element.setAttribute("aria-current", "page");
}


export function initActiveNav(){

    const currentPage =
        getCurrentPage();

    const isProduct =
        currentPage === "disc" ||
        currentPage === "tube";

    // 1. 桌機主導覽
    const topPage =
        isProduct ? "products" : currentPage;

    mark(
        document.querySelector(
            `.nav-links > a[data-page="${topPage}"], .dropdown-btn[data-page="${topPage}"]`
        )
    );

    // 2. 產品下拉選單裡的實際頁面
    if(isProduct){

        mark(
            document.querySelector(
                `.dropdown-menu a[data-page="${currentPage}"]`
            )
        );
    }

    // 3. 手機選單
    mark(
        document.querySelector(
            `.mobile-nav-link[data-mobile-page="${currentPage}"]`
        )
    );
}
