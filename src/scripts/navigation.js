import { gsap } from "gsap";

function init() {

    const border = document.querySelector('.nav_border');
    const top = border.querySelector('.top');
    const bottom = border.querySelector('.bottom');
    const navItems = document.querySelectorAll('.nav_item');
    let currentActiveItem = navItems[2];


    setTimeout(x => {
        changeActiveElement(currentActiveItem, border, top, bottom);
        border.style.visibility = 'visible';
    }, 100);



    window.addEventListener('resize', () => changeActiveElement(currentActiveItem, border, top, bottom))

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            currentActiveItem = navItem;
            changeActiveElement(currentActiveItem, border, top, bottom);
        })
    });

    animateActiveItem(border);
}

/**
 * 
 * @param {HTMLDivElement} activeElement 
 * @param {SVGElement} border 
 * @param {SVGPathElement} top 
 * @param {SVGPathElement} bottom 
 */
function changeActiveElement(activeElement, border, top, bottom) {
    let activePosition = activeElement.getBoundingClientRect();
    let borderPosition = border.getBoundingClientRect();

    border.style.width = 120;
    border.style.height = activePosition.height + 18.4;
    borderPosition = border.getBoundingClientRect();

    const borderCenterX = borderPosition.left + borderPosition.width / 2;
    const activeElementCenterX = activePosition.left + activePosition.width / 2;

    const borderCenterY = borderPosition.top + borderPosition.top / 2;
    const activeElementCenterY = activePosition.top + activePosition.top / 2;
    console.table({ borderPosition, activePosition, a: { b: 'sd' } });
    border.style.left = (borderPosition.left - (borderCenterX - activeElementCenterX));
    border.style.top = 16;


}

/**
 * 
 * @param {SVGElement} border 
 */
function animateActiveItem(border) {

    const activeRotationTimeline = gsap.timeline();

    //activeRotationTimeline.to(border, { rotateY: -180, duration: 10 });
}


export default { init };