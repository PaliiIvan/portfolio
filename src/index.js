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