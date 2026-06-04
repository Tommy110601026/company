import { initComponents } from "./component-loader.js";
import { initDropdown } from "./nav-dropdown.js";
import { initMobileMenu } from "./mobile-menu.js";
import { initActiveNav } from "./nav-active.js";
import { initContact } from "./contact.js";
import { initSlider } from "./product-slider.js";
import { initProductTabs } from "./product-tabs.js";

async function initApp(){

    await initComponents();

    initDropdown();
    initContact();
    initMobileMenu();
    initActiveNav();
    initSlider();
    initProductTabs();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);