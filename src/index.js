import gsap, { Power1 } from "gsap";

import "./styles/main.scss";
import "./styles/navigation.scss";

import "./scripts/scroll";
import "./scripts/about";
import AboutPage from "./scripts/about";
import NavigationComponent from "./scripts/navigation";

import { loadResources } from "./scripts/resource.loader";
import { loader } from "./scripts/selection";


// function onResourceLoading(asset, assetIndex, allAssetCount) {
//     const toShow = 100 / 11;
//     console.log(toShow);
//     loader.textContent = (Math.floor(toShow) * assetIndex) == 99 ? 100 : (Math.floor(toShow) * assetIndex);
// }

loadResources(() => { }).then((resources) => {
    const loader = document.querySelector(".loader");
    const mainContent = document.querySelector(".main-app");
    const timeline = gsap.timeline();
    AboutPage.init(resources);
    NavigationComponent.init();
    // timeline
    //     .to(loader, { x: "120%", duration: 2.2 })
    //     .to(loader, { display: "none" })
    //     .to(mainContent, { visibility: "visible" });
});
