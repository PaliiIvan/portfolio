import { EXPERIENCE, PAGES } from "../constants";
import { rPosition, showPage } from "../helpers";
import { sections } from "../selection";
import "./experience.scss";
import * as d3 from "d3";



export function init(resources) {
    showPage(PAGES.EXPERIENCE);



    EXPERIENCE.forEach(exp => drawSvg(exp))
}

/**
 * 
 * @param {{
 * company: string
 * positions: [
    * {
    *   name: string,
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
    /**
     * @type {DOMRect}
     */
    const {width, height} = svgContainer.node().getBoundingClientRect();

    const linePosition = {
        x1: '20%',
        y1: '10%',
        y2: height - 10 
    }

    const lineG = svgContainer.append('g')
        .attr('transform', `translate(${'1'}, ${'1'})`);

    const line = lineG.append('line')
        .attr('x1', linePosition.x1)
        .attr('y1', linePosition.y1)
        .attr('x2', linePosition.x1)
        .attr('y2', linePosition.y2)
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.2rem');

    const mainCircle = lineG.append('circle')
        .attr('cx', linePosition.x1)
        .attr('cy', linePosition.y1)
        .attr('r', mainCircleSizeR)
        .attr('fill', '#dadada');

        const circlesStep = Math.floor(linePosition.y2 / 4);
        let subCirclesPositions = [];

        const subCircles = lineG
        .selectAll('circles')
        .data(data.positions.map(x => x))
        .enter()
        .append('circle')
        .attr('r', mainCircleSizeR / 2)
        .attr('cx', linePosition.x1)
        .attr('cy', (d, i) => {
            const xPosition = circlesStep * (i + 1);

            subCirclesPositions.push(xPosition)
            return xPosition;
        })
        .attr('fill', '#dadada');


        const mainText = svgContainer.append('g')
        .attr('class','company_title_g')
        .append('text')
        .attr('class', 'company_title')
        .attr('x', linePosition.x1)
        .attr('y', linePosition.y1)
        .text(data.company);

}


export const Experience = { init };