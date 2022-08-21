import gsap, { Power1 } from "gsap";

import "./styles/main.scss";
import "./styles/navigation.scss";


import NavigationComponent from "./scripts/components/navigation";

import { loadResources } from "./scripts/resource.loader";
import { loader } from "./scripts/selection";

import { About } from "./scripts/sections/about";
import { setMainFontSize } from "./scripts/helpers";


loadResources(() => { }).then((resources) => {
    const loader = document.querySelector(".loader");
    const tm = gsap.timeline();

    tm.to(loader, {
        y: loader.getBoundingClientRect().height,
        duration: 2,
        onComplete: () => {
            reCalculateSize();
            NavigationComponent.init(resources);
            About.init(resources);
        }
    });


});


window.addEventListener('resize', ev => {
    reCalculateSize();
}, true)

function reCalculateSize() {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;

    if (w > 1920 && w <= 2048) {
        setMainFontSize(16)
    } else if (w > 1280 && w <= 1920) {
        setMainFontSize(13)
    } else if (w <= 1280) {
        setMainFontSize(10)
    }
}

/**
 * @type {HTMLDivElement} pointer
 */
const pointer = document.querySelector('#mouse_pointer');

const { width } = pointer.getBoundingClientRect();

window.addEventListener('mousemove', ({ clientX, clientY, target }) => {
    if (target instanceof SVGElement) {
        target = target.parentElement;
    }

    if (target.classList.contains('pointer')) {
        pointer.querySelector('.hover-animation').classList.add('hover');

        if (target.classList.contains('hover-move')) {
            pointer.querySelector('.hover-move').classList.add('move');
        }
    } else {
        pointer.querySelector('.hover-animation').classList.remove('hover');
        pointer.querySelector('.hover-move').classList.remove('move');
    }

    requestAnimationFrame(() => {
        pointer.style.top = `${clientY - width / 2}px`;
        pointer.style.left = `${clientX - width / 2}px`
    });
});

window.addEventListener('drag', ({ clientX, clientY, target }) => {
    console.log('hello');
    if (target instanceof SVGElement) {
        target = target.parentElement;
    }

    if (target.classList.contains('pointer')) {
        pointer.querySelector('.hover-animation').classList.add('hover');

        if (target.classList.contains('hover-move')) {
            pointer.querySelector('.hover-move').classList.add('move');
        }
    } else {
        pointer.querySelector('.hover-animation').classList.remove('hover');
        pointer.querySelector('.hover-move').classList.remove('move');
    }


});

export function moveDrugIcon(clientX, clientY, width) {

    requestAnimationFrame(() => {
        pointer.style.top = `${clientY - width / 2}px`;
        pointer.style.left = `${clientX - width / 2}px`
    });
}