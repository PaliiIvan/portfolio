import gsap from "gsap";

import { Resources } from "../resource.loader";
import { sections } from "../selection";

import "../../styles/about.scss";


function init(resources) {
    const section = document.querySelector('#about_section');
    sections.forEach(x => x.classList.remove('active'));
    section.classList.add('active');
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