import { sections } from "../selection";

function init(resources) {
    const section = document.querySelector('#projects__section');
    sections.forEach(x => x.classList.remove('active'));
    section.classList.add('active');
}


export const Projects = { init };