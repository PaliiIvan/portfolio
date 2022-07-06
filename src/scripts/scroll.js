import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";


import '../styles/scroll.scss';
import { SCROLL_DIRECTION } from "./constants";
import { navigationItems, sections } from "./selection";
import { iteratePage } from "./helpers";


function init() {

    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    let currentSectionIndex = 0
    let shouldScroll = true;

    navigationItems.forEach((scrollElem, index) => {
        scrollElem.addEventListener('click', function () {
            changePageIcon(this);
            nextSection(index);
        })
    });


    addWillHandler();

    /**
     * 
     * @param {HTMLDivElement} currentPageElem 
     */
    function changePageIcon(currentPageElem) {
        navigationItems.forEach(scrollElem => {
            scrollElem.classList.remove('scroll_item--active');
        });
        currentPageElem.classList.add('scroll_item--active');
    }

    /**
     * 
     * @param {number} pageNumber 
     */
    function nextSection(sectionNumberIndex) {
        const nextSection = sections[sectionNumberIndex];
        const currentSection = sections[currentSectionIndex];

        const scrollTimeline = gsap.timeline();

        scrollTimeline.to(window, {
            duration: 2,
            autoKill: true,
            scrollTo: { y: nextSection, offsetY: 60 },
            onAutoKill: (sd) => console.log(sd),
            onComplete: () => shouldScroll = true,
            onStart: () => shouldScroll = false
        });
    }

    function addWillHandler() {
        document.addEventListener('wheel', ev => onWheelEvent(ev));
    }


    function onWheelEvent(ev) {
        const scrollTimeline = gsap.timeline();
        if (ev.deltaY > 0 && currentSectionIndex < 3 && shouldScroll) {

            currentSectionIndex = iteratePage(currentSectionIndex, SCROLL_DIRECTION.DOWN);
            const nextSection = sections[currentSectionIndex]
            const currentNavigationItem = navigationItems[currentSectionIndex];
            changePageIcon(currentNavigationItem);

            scrollTimeline.to(window, {
                duration: 2,
                scrollTo: { y: nextSection, offsetY: 60 },
                onAutoKill: (sd) => console.log(sd),
                onComplete: () => shouldScroll = true,
                onStart: () => shouldScroll = false
            });

        } else if (ev.deltaY < 0 && currentSectionIndex > 0 && shouldScroll) {
            currentSectionIndex = iteratePage(currentSectionIndex, SCROLL_DIRECTION.TOP);
            const nextSection = sections[currentSectionIndex];
            const currentNavigationItem = navigationItems[currentSectionIndex];
            changePageIcon(currentNavigationItem);
            scrollTimeline.to(window, {
                duration: 2,
                scrollTo: { y: nextSection, offsetY: 60 },
                onAutoKill: (sd) => console.log(sd),
                onComplete: () => shouldScroll = true,
                onStart: () => shouldScroll = false
            });
        }
    }

}


init();