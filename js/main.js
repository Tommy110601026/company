import { initComponents } from "./component-loader.js";
import { initMotion } from "./motion.js";
import { initDropdown } from "./nav-dropdown.js";
import { initMobileMenu } from "./mobile-menu.js";
import { initActiveNav } from "./nav-active.js";
import { initContact } from "./contact.js";
import { initSlider } from "./product-slider.js";
import { initProductTabs } from "./product-tabs.js";
import { initDownloadList } from "./download-list.js";
import { initScrollTop } from "./scroll-top.js";
import { initStatCount } from "./stat-count.js";
import { initHeroBubbles } from "./hero-bubbles.js";
import { initSealToggle } from "./seal-toggle.js";

async function initApp(){

    // 動態相關的先跑：不必等元件載入，畫面才不會先閃一下
    initMotion();
    initHeroBubbles();
    initStatCount();
    initSealToggle();
    initSlider();
    initProductTabs();
    initScrollTop();

    // 以下需要等 footer / 手機選單 / 詢價視窗載入完成。
    // initActiveNav 也要標記手機選單裡的連結，所以必須排在後面。
    await initComponents();

    initDropdown();
    initContact();
    initMobileMenu();
    initActiveNav();
    initDownloadList();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);
