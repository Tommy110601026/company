// =========================
// Product Tabs
// =========================
//
// 這支檔案負責產品頁的分頁切換功能。
// 目前支援兩種分頁：
//
// 1. 管子頁產品特色分頁
//    button：.product-tab-item
//    panel ：.product-tab-panel
//    對應：data-panel="panel-id"
//
// 2. 盤子頁規格分頁
//    button：.spec-tab-btn
//    panel ：.spec-tab-panel
//    對應：data-spec-panel="panel-id"
//

export function initProductTabs(){

    initProductFeatureTabs();
    initSpecTabs();

}


// =========================
// 01. Product Feature Tabs
// 管子頁：產品特色左側分頁
// =========================

function initProductFeatureTabs(){

    const tabButtons =
        document.querySelectorAll(".product-tab-item");

    const tabPanels =
        document.querySelectorAll(".product-tab-panel");

    if(
        !tabButtons.length ||
        !tabPanels.length
    ){
        return;
    }

    tabButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const targetPanelId =
                    button.dataset.panel;

                const targetPanel =
                    document.getElementById(targetPanelId);

                if(!targetPanel) return;

                tabButtons.forEach((item) => {
                    item.classList.remove("active");
                });

                tabPanels.forEach((panel) => {
                    panel.classList.remove("active");
                });

                button.classList.add("active");
                targetPanel.classList.add("active");

            }
        );

    });

}


// =========================
// 02. Spec Tabs
// 盤子頁：產品規格分頁
// =========================

function initSpecTabs(){

    const specTabButtons =
        document.querySelectorAll(".spec-tab-btn");

    const specTabPanels =
        document.querySelectorAll(".spec-tab-panel");

    if(
        !specTabButtons.length ||
        !specTabPanels.length
    ){
        return;
    }

    specTabButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const targetPanelId =
                    button.dataset.specPanel;

                const targetPanel =
                    document.getElementById(targetPanelId);

                if(!targetPanel) return;

                specTabButtons.forEach((item) => {
                    item.classList.remove("active");
                });

                specTabPanels.forEach((panel) => {
                    panel.classList.remove("active");
                });

                button.classList.add("active");
                targetPanel.classList.add("active");

            }
        );

    });

}