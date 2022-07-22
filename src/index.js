import gsap, { Power1 } from "gsap";

import "./styles/main.scss";
import "./styles/navigation.scss";


import NavigationComponent from "./scripts/components/navigation";

import { loadResources } from "./scripts/resource.loader";
import { loader } from "./scripts/selection";

import { About } from "./scripts/sections/about";
import { Skills } from "./scripts/sections/skills";
import { Experience } from "./scripts/sections/experience";


loadResources(() => { }).then((resources) => {
    const loader = document.querySelector(".loader");
    const tm = gsap.timeline();

    tm.to(loader, {
        y: loader.getBoundingClientRect().height,
        duration: 2,
        onComplete: () => {
            NavigationComponent.init(resources);
            Experience.init(resources);

            // setTimeout(() => {
            //     console.log('click');
            //     //console.log(document.querySelector('.skill_lvl_1 rect'));
            //     document.querySelector('.skill_lvl_1').dispatchEvent(new Event('click'));;
            // }, 1000)
        }

    });
});
