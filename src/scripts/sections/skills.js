import { sections } from "../selection";
import * as D3 from "d3";
import { calculateMiddleValue, rectCollide, initiateDrugEvents, showPage } from "../helpers";
import "./skills.scss";
import { line, thresholdScott } from "d3";
import { animateBuildingBlocks, closeSkillDescription, createCrossIcon, deselectSkill, openSkillDescription } from "./skills.utils";
import { PAGES } from "../constants";

const SkillsDataOptions = {
    TOP: {
        class: "skill_lvl_1",
        width: 250,
        height: 250,
    },
    MIDDLE: {
        class: "skill_lvl_2",
        width: 120,
        height: 120,
    },
    LOW: {
        class: "skill_lvl_3",
        width: 74,
        height: 74,
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

    const svg = createSvg();

    //main__draw__container
    function createSvg() {
        const svg = D3.select(".skills__section__content")
            .append("svg")
            .attr("class", "main__draw__container");
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
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)
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


        const rects = nodes.append("rect")
            .attr('opacity', 0)
            .attr("width", (d) => d.width)
            .attr("height", (d) => d.height)



        const textNodes = nodes
            .append('text')
            .attr('opacity', 0)
            .attr('x', d => d.width / 2)
            .attr('y', d => d.height / 2)
            .text(d => d.name);

        var collisionForce = rectCollide()
            .size(function (d) { return [d.width, d.width] }).pending(20);


        const opacityInterpolate = D3.interpolate(1.01, -1);


        simulation = D3.forceSimulation(data)
            //Disable x y simulation on drag
            .force("x", D3.forceX(width / 2).strength(0.01))
            .force("y", D3.forceY(height / 2).strength(0.01))
            .force("collide", collisionForce)
            .on("tick", function () {


                nodes.attr('transform', function (d) {
                    const newX = calculateMiddleValue(d.x, width - d.width);
                    const newY = calculateMiddleValue(d.y, height - d.height);

                    return `translate(${d.x}, ${d.y}) rotate(0)`;
                });


                rects.attr("opacity", opacityInterpolate(this.alpha()));
                textNodes.attr("opacity", opacityInterpolate(this.alpha()));
            });

        nodes.call(initiateDrugEvents(simulation))


        function onClick(currentNode) {
            rects.transition().duration(1000).attr("opacity", 1);
            textNodes.transition().duration(1000).attr("opacity", 1);

            nodes.call(initiateDrugEvents.nullDrag);

            let onCrossXClick = (ev) => {
                ev.stopPropagation();
                closeSkillDescription();
                deselectSkill(nodes)
                isBuilded = false;
                nodes.call(initiateDrugEvents.activeDrag);
            };

            let onBuildingEnd = () => {
                createCrossIcon(currentNode, onCrossXClick);
                openSkillDescription(currentNode, svg, nodes);
                isBuilded = true;
            };

            if (!isBuilded) {
                animateBuildingBlocks(nodes, height, onBuildingEnd, isBuilded);
            } else {
                createCrossIcon(currentNode, onCrossXClick);
                openSkillDescription(currentNode, svg, nodes);
            }
        }
    }
}



export const Skills = { init };