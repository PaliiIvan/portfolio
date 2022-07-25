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
    const positionsArr = data.positions.map(x => x);
    const mainCircleSizeR = 10;

    const svgContainer = d3.select(`.${data.company}`);
    /**
     * @type {DOMRect}
     */
    const {width, height, x, y} = svgContainer.node().getBoundingClientRect();

    const linePosition = {
        x1: 100,
        y1: 100,

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
        .data(positionsArr)
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
        .attr('x', linePosition.x1 + 50)
        .text(data.company)

        .attr('y', function() {
            const {height} = this.getBoundingClientRect();
            return linePosition.y1 + height / 4;
        });


        const subItemsG = svgContainer.append('g');

        
        const itemH = 176;

        const rects = subItemsG
        .selectAll('rects')
        .data(positionsArr)
        .enter()
        .append('rect')
        .attr('x', linePosition.x1)
        .attr('y', function(d, i) {
            return subCirclesPositions[i] - 20;
        })
        .attr('width', width - linePosition.x1 - 2)
        .attr('height', itemH)
        //.attr('stroke', '#dadada')
        //.attr('stroke-width', 2)
        .attr('fill', 'transparent');
        
        subItemsG
        .selectAll('sub-text')
        .data(positionsArr)
        .enter()
        .append('text')
        .attr('class', 'position_title')
        .attr('x', linePosition.x1 + 50)
        .text(d => d.name)
        .attr('y', function(d, i) {
            const {height} = this.getBoundingClientRect();
            d.mainTextY = subCirclesPositions[i] + height / 4;
            return d.mainTextY;
        });

        const newG = svgContainer.insert('g', ':first-child');
        const fOb = newG.selectAll('sub-text-desc')
        .data(positionsArr)
        .enter()
        .append('foreignObject')
        .attr('class', 'desc-text')
        .attr('x', linePosition.x1 + 50)
        .attr('y', d => d.mainTextY + 30)
        .attr('width', width - linePosition.x1 - 50)
        .attr('height', itemH);

        fOb
        .html((d) => `<div>${d.shortDescription}</div>`);
       


        rects.on('mouseover', function() {
            const thisRect = d3.select(this);
            thisRect.transition()
            .duration(1000)
            .attr('fill', '#dadada')
            .attr('color', 'white')



        })
        .on('mouseout', function() {
            const thisRect = d3.select(this);
            thisRect.transition()
            .duration(1000)
            .attr('fill', 'transparent')
        })
        
}


export const Experience = { init };