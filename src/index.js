import gsap, { Power1 } from "gsap";

import "./styles/main.scss";
import "./styles/navigation.scss";

import "./scripts/scroll";
import "./scripts/about";
import { loadResources } from "./scripts/resource.loader";
import { loader } from "./scripts/selection";

function onResourceLoading(asset, assetIndex, allAssetCount) {
  const toShow = 100 / allAssetCount;
  console.log(toShow);
  loader.textContent = toShow * assetIndex;
}

loadResources(onResourceLoading).then((resources) => {
  const loader = document.querySelector(".loader");
  const mainContent = document.querySelector(".main-app");
  const timeline = gsap.timeline();

  timeline
    .to(loader, { x: "120%", duration: 2.2 })
    .to(loader, { display: "none" })
    .to(mainContent, { visibility: "visible" });
});
