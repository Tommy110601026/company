import { initComponents } from "./component-loader.js";
import { initDropdown } from "./nav-dropdown.js";
import { initMobileMenu } from "./mobile-menu.js";
import { initActiveNav } from "./nav-active.js";
import { initContact } from "./contact.js";
import { initSlider } from "./product-slider.js";

async function initApp(){

    await initComponents();

    initDropdown();
    initContact();
    initMobileMenu();
    initActiveNav();
    initSlider();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);