import { gsap, Power1 } from "gsap";

import { PageInitHandlers, PAGES, PAGESStr, SCROLL_DIRECTION } from "../constants";
import { iteratePage, PageHandel, pxToRem, showPage } from "../helpers";
import { navItems } from "../selection";

import { Experience } from "../sections/experience";
import { About } from "../sections/about";
import { Skills } from "../sections/skills";
import { Resources } from "../resource.loader";




function init(resources) {

    const svgPathTop = 'M 5 5, H 115';
    const svgPathBottom = 'M 115 35, H 5';


    const initialTop = 'M 5 5';
    const initialBottom = 'M 115 35, H 115';

    let currentSectionIndex = 0
    let prevSectionIndex = currentSectionIndex;
    let shouldScroll = true;
    let currentActiveItem = navItems[PAGES.ABOUT];

    //changeActiveElement(currentActiveItem, svg_container);

    //const timelines = drawActivePaths(topBorder, bottomBorder);



    addWheelHandler(resources);
    addNavItemClickHandler();



    function addNavItemClickHandler() {
        navItems.forEach((navItem, index) => {
            navItem.addEventListener('click', () => {

                currentActiveItem = navItem;
                currentSectionIndex = index;
                changeActiveElement(currentActiveItem);
                changeSection(index, resources);
                //animateActiveItem();

            })
        });
    }


    /**
     * 
     * @param {HTMLDivElement} activeElement 
     * @param {SVGElement} svg_container 
     */
    function changeActiveElement(activeElement) {
        navItems.forEach(navItem => navItem.classList.remove('nav_item--active'));
        activeElement.classList.add('nav_item--active');
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
        const transitionItemWidth = window.screen.width;

        pageTransition.fromTo(transitionItem,
            { x: -transitionItemWidth, duration: 0 },
            { x: transitionItemWidth, duration: 4 })
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
                    onInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.about_icon]);
                        showPageTransition(() => About.init(resources));
                    },
                    onReInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.about_icon]);
                        showPageTransition(() => showPage(PAGES.ABOUT))
                    },
                    page: PAGES.ABOUT
                })
                break;
            };
            case PAGES.SKILLS: {
                PageHandel({
                    onInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.anvil_page_icon]);
                        showPageTransition(() => Skills.init(resources))
                    },
                    onReInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.anvil_page_icon]);
                        showPageTransition(() => showPage(PAGES.SKILLS))
                    },
                    page: PAGES.SKILLS
                })
                break;
            };
            case PAGES.EXPERIENCE: {
                PageHandel({
                    onInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.sword_border]);
                        showPageTransition(() => Experience.init(resources))
                    },
                    onReInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.sword_border]);
                        showPageTransition(() => showPage(PAGES.EXPERIENCE))
                    },
                    page: PAGES.EXPERIENCE
                })
                break;
            };
            default: {
                PageHandel({
                    onInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.sword_border]);
                        showPageTransition(() => About.init(resources))
                    },
                    onReInitPage: () => {
                        changeTransitionBlockImage(resources[Resources.sword_border]);
                        showPageTransition(() => showPage(PAGES.ABOUT))
                    },
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

    function changeTransitionBlockImage(image) {
        const treeContainer = document.querySelector('.transition');
        treeContainer.innerHTML = image;
        const svg = treeContainer.querySelector('svg');

        const circ_out = svg.querySelector('#circ_out');
        const circ_in = svg.querySelector('#circ_in');




        gsap.to(circ_out, {
            duration: 3,
            rotation: 180,
            transformOrigin: 'center'
        });

        gsap.to(circ_in, {
            duration: 3,
            rotation: -90,
            transformOrigin: 'center'
        })


    }
}


export default { init };