import { Resources } from "./resource.loader";

import "../styles/about.scss";


export function init(resources) {
    const treeIcon = resources[Resources.yggdrasil];
    addIcon(treeIcon);
}


function addIcon(treeIcon) {
    const treeContainer = document.querySelector('.yggdrasil');
    treeContainer.innerHTML = treeIcon;
}


export default { init };