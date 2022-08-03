import gsap, { Power1 } from "gsap";

import "./styles/main.scss";
import "./styles/navigation.scss";


import NavigationComponent from "./scripts/components/navigation";

import { loadResources } from "./scripts/resource.loader";
import { loader } from "./scripts/selection";

import { About } from "./scripts/sections/about";


loadResources(() => { }).then((resources) => {
    const loader = document.querySelector(".loader");
    const tm = gsap.timeline();

    tm.to(loader, {
        y: loader.getBoundingClientRect().height,
        duration: 2,
        onComplete: () => {
            NavigationComponent.init(resources);
            About.init(resources);
        }

    });
});
