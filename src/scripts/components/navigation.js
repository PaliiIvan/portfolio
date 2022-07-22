import { gsap, Power1 } from "gsap";

import { PageInitHandlers, PAGES, PAGESStr, SCROLL_DIRECTION } from "../constants";
import { iteratePage, PageHandel, showPage } from "../helpers";
import { navItems, svg_container, topBorder, bottomBorder } from "../selection";

import { Projects } from "../sections/projects";
import { Experience } from "../sections/experience";
import { About } from "../sections/about";
import { Skills } from "../sections/skills";




function init(resources) {

    const svgPathTop = 'M 5 5, H 115';
    const svgPathBottom = 'M 115 35, H 5';


    const initialTop = 'M 5 5';
    const initialBottom = 'M 115 35, H 115';

    let currentSectionIndex = 0
    let prevSectionIndex = currentSectionIndex;
    let shouldScroll = true;
    let currentActiveItem = navItems[PAGES.EXPERIENCE];

    changeActiveElement(currentActiveItem, svg_container);

    const timelines = drawActivePaths(topBorder, bottomBorder);



    addWheelHandler(resources);
    addNavItemClickHandler();
    addResizeHandler();



    function addResizeHandler() {
        window.addEventListener('resize', () => changeActiveElement(currentActiveItem, svg_container));
    }

    function addNavItemClickHandler() {
        navItems.forEach((navItem, index) => {
            navItem.addEventListener('click', () => {

                currentActiveItem = navItem;
                currentSectionIndex = index;
                changeActiveElement(currentActiveItem, svg_container);
                changeSection(index, resources);
                animateActiveItem();

            })
        });
    }


    /**
     * 
     * @param {HTMLDivElement} activeElement 
     * @param {SVGElement} svg_container 
     */
    function changeActiveElement(activeElement, svg_container) {
        let activePosition = activeElement.getBoundingClientRect();
        let borderPosition = svg_container.getBoundingClientRect();

        svg_container.style.width = 120;
        svg_container.style.height = activePosition.height + 18.4;
        borderPosition = svg_container.getBoundingClientRect();

        const borderCenterX = borderPosition.left + borderPosition.width / 2;
        const activeElementCenterX = activePosition.left + activePosition.width / 2;

        svg_container.style.left = (borderPosition.left - (borderCenterX - activeElementCenterX));
        svg_container.style.top = 16;
    }

    /**
     * 
     * @param {SVGElement} svg_container 
     * @param {SVGElement} top 
     * @param {SVGElement} bottom 
     */
    function drawActivePaths(top, bottom) {
        top.setAttribute('d', initialTop);
        bottom.setAttribute('d', initialBottom);

        const timelineTop = gsap.timeline();
        const timelineBottom = gsap.timeline();

        timelineTop.to(top, { attr: { d: svgPathTop }, duration: 0.8, ease: Power1.easeOut })
            .to(top, { attr: { d: svgPathTop + ', v 15' }, duration: 1 });

        timelineBottom.to(bottom, { attr: { d: svgPathBottom }, duration: 0.8, ease: Power1.easeOut })
            .to(bottom, { attr: { d: svgPathBottom + ', v -15' }, duration: 1 });

        return {
            timelineBottom,
            timelineTop
        }
    }

    /**
     * 
     * @param {() => void)} onAnimationEnd 
     */
    function showPageTransition(onAnimationEnd) {
        const pageTransition = gsap.timeline();
        const transitionItem = document.querySelector('.transition');
        const transitionItemWidth = transitionItem.getBoundingClientRect().width;

        pageTransition.fromTo(transitionItem, { x: -transitionItemWidth, duration: 0 }, { x: transitionItemWidth, duration: 4 })
            .set(transitionItem, { onComplete: onAnimationEnd, delay: -2.8 });
    }

    /**
     * 
     * @param {{[string]: any}} resources 
     */
    function addWheelHandler(resources) {
        document.addEventListener('wheel', ev => onWheelEvent(ev, resources));
    }

    /**
     * 
     * @param {WheelEvent} ev 
     * @param {{[string]: any}} resources 
     */
    function onWheelEvent(ev, resources) {

        if (ev.deltaY > 0 && currentSectionIndex < 3 && shouldScroll) {
            currentSectionIndex = iteratePage(currentSectionIndex, SCROLL_DIRECTION.DOWN);
        } else if (ev.deltaY < 0 && currentSectionIndex > 0 && shouldScroll) {
            currentSectionIndex = iteratePage(currentSectionIndex, SCROLL_DIRECTION.TOP);
        }

        currentActiveItem = navItems[currentSectionIndex];

        if (prevSectionIndex !== currentSectionIndex) {
            changeSection(currentSectionIndex, resources);
            changeActiveElement(currentActiveItem, svg_container);
            animateActiveItem();
            prevSectionIndex = currentSectionIndex;
        }

    }

    /**
     * 
     * @param {number} index 
     * @param {{[string]: any}} resources 
     */
    function changeSection(index, resources) {
        switch (index) {
            case PAGES.ABOUT: {

                PageHandel({
                    onInitPage: () => showPageTransition(() => About.init(resources)),
                    onReInitPage: () => showPageTransition(() => showPage(PAGES.ABOUT)),
                    page: PAGES.ABOUT
                })
                break;
            };
            case PAGES.SKILLS: {
                PageHandel({
                    onInitPage: () => showPageTransition(() => Skills.init(resources)),
                    onReInitPage: () => showPageTransition(() => showPage(PAGES.SKILLS)),
                    page: PAGES.SKILLS
                })
                break;
            };
            case PAGES.EXPERIENCE: {
                PageHandel({
                    onInitPage: () => showPageTransition(() => Experience.init(resources)),
                    onReInitPage: () => showPageTransition(() => showPage(PAGES.EXPERIENCE)),
                    page: PAGES.EXPERIENCE
                })
                break;
            };
            case PAGES.PROJECTS: {
                PageHandel({
                    onInitPage: () => showPageTransition(() => Projects.init(resources)),
                    onReInitPage: () => showPageTransition(() => showPage(PAGES.PROJECTS)),
                    page: PAGES.PROJECTS
                })
                break;
            };
            default: {
                PageHandel({
                    onInitPage: () => showPageTransition(() => About.init(resources)),
                    onReInitPage: () => showPageTransition(() => showPage(PAGES.ABOUT)),
                    page: PAGES.ABOUT
                })
                break;
            }
        }
    }


    function animateActiveItem() {
        timelines.timelineBottom.restart();
        timelines.timelineTop.restart();
    }




}


export default { init };