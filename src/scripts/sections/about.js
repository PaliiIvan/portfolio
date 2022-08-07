import gsap, { Power1 } from "gsap";
import * as d3 from 'd3';
import { Resources } from "../resource.loader";
import { sections } from "../selection";

import "./about.scss";
import { showPage } from "../helpers";
import { PAGES } from "../constants";
import Vivus from "vivus";
import { showAnimationText } from "./about.utils";

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
    const svg = treeContainer.querySelector('svg');
    const allPaths = svg.querySelectorAll('path');
    tm.to(treeContainer, { opacity: 1, duration: 1 });


    let res = new Vivus(svg,
        {
            duration: 1500,
            type: 'oneByOne',
            reverseStack: true,
            animTimingFunction: Vivus.EASE_IN
        });


    res.play(1, () => tm.to(allPaths, {
        duration: 2,
        fill: '#dadada',
        stroke: 'transparent'
    }));


    showAnimationText();
}



export const About = { init };