import gsap, { Power1 } from "gsap";
import { Resources } from "../resource.loader";
import { sections } from "../selection";

import "./about.scss";
import { showPage } from "../helpers";
import { PAGES } from "../constants";
import Vivus from "vivus";
import { showAnimationText } from "./about.utils";

function init(resources) {
    showPage(PAGES.ABOUT)
    //const treeIcon = resources[Resources.yggdrasil];
    console.log('About');
    addIcon();
    showAnimationText(resources);
}


function addIcon() {
    const treeContainer = document.querySelector('.yggdrasil');

    //treeContainer.innerHTML = treeIcon;

    const tm = gsap.timeline();
    const svg = treeContainer.querySelector('svg');
    const treeParts = {
        leafage: svg.querySelector('#leafage'),
        branches: svg.querySelector('#branches'),
        top_roots: svg.querySelector('#top_roots'),
        down_roots: svg.querySelector('#down_roots')
    }
    const allPaths = svg.querySelectorAll('path');

    gsap.to(svg, { opacity: 1, duration: 2 });

    vivusTimeLine(treeParts.down_roots, {
        duration: 100,
        type: 'sync',
        onReady() {


        }
    }).then(treeParts.top_roots, {
        duration: 200,
        type: 'sync',
        reverseStack: true
    }).then(treeParts.branches, {
        duration: 400,
        type: 'sync',
        reverseStack: true
    }).then(treeParts.leafage, {
        duration: 500,
        delay: 10,
        type: 'sync',
        onComplete() {
            tm.to(allPaths, {
                duration: 2,
                fill: '#dadada',
                stroke: 'transparent'
            })
        }
    })
        .run()



    /**
     * @param {HTMLElement} forItem 
     * @param {Vivus.VivusOptions} conf 
     * @returns 
     */
    function vivusTimeLine(forItem, conf) {
        const inst = [];
        const callBackList = [];
        let viv = new Vivus(forItem, conf);

        callBackList.push(conf.onComplete)
        inst.push(viv);

        return ({
            /**
             * @param {HTMLElement} forItem 
             * @param {Vivus.VivusOptions & {onComplete():void}} conf 
             * @returns 
             */
            then(forItem, conf) {
                let viv = new Vivus(forItem, { ...conf, start: 'manual' });

                inst.push(viv);
                callBackList.push(conf.onComplete)
                return this;
            },

            run() {
                playAnimation(0);
            }
        });

        function playAnimation(index) {
            inst[index].play(() => {

                if (callBackList[index]) {
                    callBackList[index]();
                }

                index = index + 1;

                if (index < inst.length) {
                    playAnimation(index);
                }
            })
        }
    }
}



export const About = { init };