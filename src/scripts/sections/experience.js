import { EXPERIENCE, PAGES } from "../constants";
import { createSvg, rPosition, showPage } from "../helpers";
import { sections } from "../selection";
import "./experience.scss";
import * as d3 from "d3";
import { addContentToCards, addEventListenersToCards, animateAllPageOnFirstLoad, animateBlockHover, displayPositionInformation, drawMainComponents, makePositionActive, onCloseClick, resetBorder, showCloseIcon, showInformationContainer } from "./experience.utils";



let isPageCreated = false;
export function init(resources) {
    if (!isPageCreated) {
        showPage(PAGES.EXPERIENCE);
        EXPERIENCE.forEach(exp => drawSvg(exp))
        isPageCreated = true;
    }
}

/**
 * 
 * @param {{
 * company: string
 * positions: [
    * {
    *   name: string,
    *   pos: string,
    *   shortDescription: string,
    *   fullDescription: {
    *       projectDesc: string,
    *       roleDescription: string
    * }
    * }
 * ]
 * }} data 
 */
function drawSvg(data) {
    const mainCircleSizeR = 10;

    const svgContainer = d3.select(`.${data.company}`);


    const {
        line,
        mainCircle,
        mainText,
        subCircles,
        subItemsG,
        subCirclesPositions
    } = drawMainComponents(data, mainCircleSizeR, svgContainer);

    animateAllPageOnFirstLoad(line, mainCircle, subCircles, subItemsG);
}


export const Experience = { init };