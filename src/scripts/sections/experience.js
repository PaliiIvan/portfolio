import { sections } from "../selection";

export function init(resources) {
    const section = document.querySelector('#experience__section');
    sections.forEach(x => x.classList.remove('active'));
    section.classList.add('active');
}



export const Experience = { init };