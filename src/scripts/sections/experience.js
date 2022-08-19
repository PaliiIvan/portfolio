import { EXPERIENCE, PAGES } from "../constants";
import { createSvg, pxToRem, rPosition, showPage, throttle } from "../helpers";
import { experience__section, sections } from "../selection";
import "./experience.scss";
import * as d3 from "d3";
import gsap from "gsap";
import { addContentToCards, addEventListenersToCards, animateAllPageOnFirstLoad, animateBlockHover, displayPositionInformation, drawMainComponents, makePositionActive, onCloseClick, resetBorder, showCloseIcon, showInformationContainer } from "./experience.utils";




export function init(resources) {
    const mainSvgContainers = experience__section.querySelectorAll('.main_c_svg');
    gsap.to(mainSvgContainers, {
        onComplete() {
            mainSvgContainers.forEach(x => x.innerHTML = '')
            EXPERIENCE.forEach(exp => drawSvg(exp));
            onResizeChange();
        },
        duration: 0.1
    });
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

function onResizeChange() {
    const reRenderFn = throttle(() => {
        const mainSvgContainers = experience__section.querySelectorAll('.main_c_svg');
        gsap.to(mainSvgContainers, {
            opacity: 0,
            onComplete() {
                mainSvgContainers.forEach(x => x.innerHTML = '')
                EXPERIENCE.forEach(exp => drawSvg(exp));
                gsap.to(mainSvgContainers, { opacity: 1 });
            },
            duration: 0.1
        });

    }, 100)


    window.addEventListener('resize', () => {
        reRenderFn();
    })
}

export const Experience = { init };