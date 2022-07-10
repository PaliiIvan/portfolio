import { sections } from "../selection";

export function init(resources) {
    const section = document.querySelector('#skills_section');
    sections.forEach(x => x.classList.remove('active'));
    section.classList.add('active');
}






export const Skills = { init };