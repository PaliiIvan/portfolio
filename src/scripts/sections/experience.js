import { EXPERIENCE, PAGES } from "../constants";
import { createSvg, rPosition, showPage } from "../helpers";
import { sections } from "../selection";
import "./experience.scss";
import * as d3 from "d3";
import { animateBlockHover, displayPositionInformation, makePositionActive, onCloseClick, resetBorder, showCloseIcon, showInformationContainer } from "./experience.utils";



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
    const positionsArr = data.positions.map(x => x);
    const mainCircleSizeR = 10;

    const svgContainer = d3.select(`.${data.company}`);
    /**
     * @type {DOMRect}
     */
    const { width, height, x, y } = svgContainer.node().getBoundingClientRect();

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
            const yPosition = circlesStep * (i + 1);

            subCirclesPositions.push(yPosition)
            return yPosition;
        })
        .attr('fill', '#dadada');


    const mainText = svgContainer.append('g')
        .attr('class', 'company_title_g')
        .append('text')
        .attr('class', 'company_title')
        .attr('x', linePosition.x1 + 50)
        .text(data.company)

        .attr('y', function () {
            const { height } = this.getBoundingClientRect();
            return linePosition.y1 + height / 4;
        });


    const subItemsG = svgContainer
        .selectAll('sub_g')
        .data(positionsArr)
        .enter()
        .append('g')
        .attr('class', 'position-svg-container');


    const itemH = 176;

    subItemsG
        .attr('transform', 'translate(1,1)')
        .attr('id', d => `${d.name}-${data.company}`)
        .append('text')
        .attr('class', 'position_title')
        .attr('x', linePosition.x1 + 50)
        .text(d => d.name)
        .attr('y', function (d, i) {
            const { height } = this.getBoundingClientRect();
            d.mainTextY = subCirclesPositions[i] + height / 4;
            return d.mainTextY;
        });

    subItemsG.append('foreignObject')
        .attr('class', 'desc-text')
        .attr('x', linePosition.x1 + 50)
        .attr('y', function (d, i) {
            return subCirclesPositions[i] + 25;
        })
        .attr('width', width - linePosition.x1 - 50)
        .attr('height', itemH - 32)
        .html((d) => `<div>${d.shortDescription}</div>`)


    subItemsG.each((sb, index, g) => {
        const div = g[index].querySelector('div');
        const divSize = div.getBoundingClientRect();
        const foreignObject = g[index].querySelector('foreignObject');
        foreignObject.setAttribute('height', divSize.height);
    });


    let hoverAnimationResult;
    subItemsG.each(function (positionData, index, arr) {
        const id = this.getAttribute('id');
        const divContainer = this.querySelector('div');
        const nameNode = this.querySelector('text');

        const { x, y, height } = this.getBBox();
        const circleOldPos = subCirclesPositions[positionData.pos];
        const circle = subCircles.filter((f, i) => i === positionData.pos);
        const lineX1 = line.attr('x1');

        let shouldStopReverseAnimation = false;

        const rect = createSvg('rect')
            .attr('x', lineX1)
            .attr('y', y - 30)
            .attr('width', width - lineX1 - 2)
            .attr('height', height + 60)
            .elem;

        rect.classList.add('hover-rect');



        this.addEventListener('mouseover', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (!shouldStopReverseAnimation) {
                hoverAnimationResult = animateBlockHover(rect, svgContainer, circle, circleOldPos, id);
            }
        })

        this.addEventListener('mouseout', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (!shouldStopReverseAnimation) {
                resetBorder(hoverAnimationResult);
            }

        });

        this.addEventListener('click', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            shouldStopReverseAnimation = true;
            let rectangleActiveTml = makePositionActive(rect, divContainer, nameNode);
            let positionInformationTm = showInformationContainer(this, () => displayPositionInformation(positionData, data.company));

            const closePositionDescription = () => {
                onCloseClick({
                    contentRectTimeline: positionInformationTm,
                    rectangleTimeLine: rectangleActiveTml,
                    onComplete: () => {
                        resetBorder(hoverAnimationResult);
                        shouldStopReverseAnimation = false;

                    }
                })
            }

            showCloseIcon(this, closePositionDescription);


        })

        this.insertBefore(rect, nameNode);
        // this.append(rect)





    });




    //let hoverAnimationResult;
    // rects.on('mouseover', function () {
    //     const thisRect = d3.select(this);
    //     const data = thisRect.datum();
    //     const circleOldPos = subCirclesPositions[data.pos];
    //     const circle = subCircles.filter((f, i) => i === data.pos);


    //     hoverAnimationResult = animateBlockHover(circle, thisRect, svgContainer, circleOldPos);

    // })
    //     .on('mouseout', function () {
    //         resetBorder(hoverAnimationResult);
    //     })

}


export const Experience = { init };