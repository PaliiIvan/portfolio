import { skills_section } from "../selection";
import * as D3 from "d3";
import { initiateDrugEvents, showPage, toRemStr, remToPx, throttle } from "../helpers";
import "./skills.scss";

import { addGradient, animateBuildingBlocks, closeSkillDescription, createCrossIcon, deselectSkill, openSkillDescription } from "./skills.utils";
import { PAGES } from "../constants";
import gsap from "gsap";

export const SkillsDataOptions = {
    TOP: {
        class: "skill_lvl_1 pointer hover-move",
        width: 15,
        height: 15,
        r: 7.5
    },
    MIDDLE: {
        class: "skill_lvl_2 pointer hover-move",
        width: 6.875,
        height: 6.875,
        r: 3.4375
    },
    LOW: {
        class: "skill_lvl_3 pointer hover-move",
        width: 4.625,
        height: 4.625,
        r: 1.875
    },
};

const SkillsData = [
    {
        name: "React.js",
        ...SkillsDataOptions.TOP
    },

    {
        name: "Redux",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "SCSS",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "CSS",
        ...SkillsDataOptions.TOP
    },
    {
        name: "Node.js",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "Angular",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "HTML",
        ...SkillsDataOptions.TOP
    },
    {
        name: "TS",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "D3.js",
        ...SkillsDataOptions.MIDDLE,
    },
    {
        name: "JS",
        ...SkillsDataOptions.TOP
    },
];

var simulation;
let isBuilded = false;

export function init(resources) {
    showPage(PAGES.SKILLS);
    createSvg();
    onResizeChange();


    //main__draw__container
    function createSvg() {
        const svg = D3.select(".skills__section__content")
            .append("svg")
            .attr("class", "main__draw__container");

        addGradient(svg.node());

        const { width, height } = svg.node().getBoundingClientRect();

        const data = SkillsData.map((d, index) => ({
            ...d,
            x: Math.random() * (width - d.width),
            y: Math.random() * (height - d.height),
        }));

        const nodes = svg
            .selectAll("rec")
            .data(data, (d) => d.id)
            .enter()
            .append('g')
            .attr("class", (d) => d.class)
            .attr("width", (d) => toRemStr(d.width))
            .attr("height", (d) => toRemStr(d.height))
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .on('mouseover', function (ev) {
                this.classList.add('hover');

            })
            .on('mouseout', function () {
                this.classList.remove('hover');
            })
            .on('click', function (ev, d) {
                nodes.nodes().forEach(n => n.classList.remove('active'));
                this.classList.toggle('active');

                simulation.stop();
                onClick(this);
            });


        const rects = nodes.append("circle")
            .attr('r', d => toRemStr(d.r))
            .attr('fill', "url('#skill_gradient')")




        const textNodes = nodes
            .append('text')
            .attr('x', d => d.cx)
            .attr('y', d => d.cy)
            .text(d => d.name);

        simulation = D3.forceSimulation(data)
            //Disable x y simulation on drag
            .alphaTarget(0.3)
            .force("x", D3.forceX(width / 2).strength(0.005))
            .force("y", D3.forceY(height / 2).strength(0.005))
            .force("charge", D3.forceManyBody().strength(-10))
            .force("collide", D3.forceCollide().radius(d => remToPx(d.r) + 2))
            .on("tick", function () {

                nodes.attr('transform', function (d) {
                    return `translate(${d.x}, ${d.y}) rotate(0)`;
                });
            });

        nodes.call(initiateDrugEvents(simulation))


        function onClick(currentNode) {

            //makerCircleActive(currentNode)
            nodes.call(initiateDrugEvents.nullDrag);

            let openDescTm;
            let onCrossXClick = (ev) => {
                ev.stopPropagation();
                closeSkillDescription(openDescTm);
                deselectSkill(nodes, simulation)
                isBuilded = false;
                nodes.call(initiateDrugEvents.activeDrag);

                nodes.nodes().forEach(x => {
                    x.classList.add('hover-move');
                });
            };

            let onBuildingEnd = () => {
                openDescTm = openSkillDescription(currentNode, svg, nodes, () => createCrossIcon(currentNode, onCrossXClick));
                isBuilded = true;
            };

            if (!isBuilded) {
                animateBuildingBlocks(nodes, height, onBuildingEnd, isBuilded);
            } else {
                openDescTm = openSkillDescription(currentNode, svg, nodes, () => createCrossIcon(currentNode, onCrossXClick));

            }
        }
    }

    function onResizeChange() {
        const reRenderFn = throttle(() => {
            const mainSvgContainer = skills_section.querySelector('.main__draw__container');
            gsap.to(mainSvgContainer, {
                opacity: 0,
                onComplete() {
                    mainSvgContainer.remove();
                    createSvg();
                },
                duration: 0.1
            });

        }, 100)


        window.addEventListener('resize', () => {
            reRenderFn();
        })
    }
}





export const Skills = { init };