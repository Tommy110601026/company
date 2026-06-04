// =========================
// Component Loader
// =========================

function getCurrentLocale(){

    const path =
        window.location.pathname;

    return path.includes("/zh/") ? "zh" : "en";

}

async function loadComponent(id, file){

    const target =
        document.getElementById(id);

    if(!target){
        return;
    }

    try{

        const response =
            await fetch(file);

        if(!response.ok){

            throw new Error(
                `Failed to load: ${file}`
            );

        }

        const data =
            await response.text();

        target.innerHTML = data;

    }
    catch(error){

        console.error(error);

    }

}

export async function initComponents(){

    const locale =
        getCurrentLocale();

    await loadComponent(
        "mobile-menu",
        `../components/${locale}/mobile-menu.html`
    );

    await loadComponent(
        "inquiry-modal",
        `../components/${locale}/inquiry-modal.html`
    );

    await loadComponent(
        "footer",
        `../components/${locale}/footer.html`
    );

}