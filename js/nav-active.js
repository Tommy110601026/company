// =========================
// Active Navigation
// =========================

function getCurrentPage(){

    const path =
        window.location.pathname;

    if(
        path === "/" ||
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

    if(path.includes("disc-diffuser.html")){
        return "disc";
    }

    if(path.includes("tube-diffuser.html")){
        return "tube";
    }

    return "home";

}

export function initActiveNav(){

    const currentPage =
        getCurrentPage();

    const desktopPage =
        currentPage === "disc" ||
        currentPage === "tube"
            ? "products"
            : currentPage;

    const desktopActiveLink =
        document.querySelector(
            `[data-page="${desktopPage}"]`
        );

    const mobileActiveLink =
        document.querySelector(
            `.mobile-nav-link[data-mobile-page="${currentPage}"]`
        );

    desktopActiveLink
        ?.classList
        .add("active");

    mobileActiveLink
        ?.classList
        .add("active");

}