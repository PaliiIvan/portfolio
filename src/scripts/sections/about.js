import gsap, { Power1 } from "gsap";
import * as d3 from 'd3';
import { Resources } from "../resource.loader";
import { sections } from "../selection";

import "./about.scss";
import { showPage } from "../helpers";
import { PAGES } from "../constants";


function init(resources) {
    showPage(PAGES.ABOUT)
    const treeIcon = resources[Resources.yggdrasil];

    addIcon(treeIcon);
}


function addIcon(treeIcon) {
    const treeContainer = document.querySelector('.yggdrasil');
    treeContainer.style.opacity = 0;
    treeContainer.innerHTML = treeIcon;

    const tm = gsap.timeline();

    tm.to(treeContainer, { opacity: 1, duration: 1 });
}



export const About = { init };