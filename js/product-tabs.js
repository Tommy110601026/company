// =========================
// Product Spec Tabs
// =========================

export function initProductTabs(){

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