import gsap, { Power1 } from "gsap";
import * as d3 from "d3";
import { createSvg } from "../helpers";
/**
 * @param {SVGRectElement} currentG
 * @param {d3.Selection<SVGCircleElement>} circle 
 * @param {d3.Selection<SVGRectElement>} block 
 * @param {d3.Selection<SVGAElement>} svgContainer 
 */
export function animateBlockHover(currentRect, svgContainer, circle, circleYPos, id) {


    circle.attr('cy', circleYPos);

    const circlePos = {
        x: +circle.attr('cx'),
        y: circleYPos,
        r: +circle.attr('r'),
    }


    const rectPos = currentRect.getBBox();

    const borderGroup = svgContainer
        .append('g')
        .attr('class', 'border-container')
        .attr('id', `_${id}`);


    const secondCircle = borderGroup
        .append('circle')
        .attr('cx', circlePos.x)
        .attr('cy', circlePos.y)
        .attr('r', circlePos.r)
        .attr('fill', '#dadada');

    const borderTop = borderGroup
        .append('line')
        .attr('x1', circlePos.x)
        .attr('y1', rectPos.y)
        .attr('x2', circlePos.x)
        .attr('y2', rectPos.y)
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);

    const borderBottom = borderGroup
        .append('line')
        .attr('x1', circlePos.x)
        .attr('x2', circlePos.x)
        .attr('y1', rectPos.y + rectPos.height)
        .attr('y2', rectPos.y + rectPos.height)
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);

    const borderRight = borderGroup
        .append('line')
        .attr('x1', rectPos.x + rectPos.width)
        .attr('y1', rectPos.y)
        .attr('x2', rectPos.x + rectPos.width)
        .attr('y2', rectPos.y)
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);


    const borderTopNode = borderTop.node();
    const borderBottomNode = borderBottom.node();
    const borderRightNode = borderRight.node();

    const borderTm = gsap.timeline({
        id, onReverseComplete: () => {
            borderGroup.remove();
            console.log('border removed', id);
        }
    });

    borderTm
        .to(circle.node(), {
            duration: 0.5,
            attr: {
                'cy': rectPos.y
            }
        })
        .to(secondCircle.node(), {
            duration: 0.5,
            attr: {
                'cy': rectPos.y + rectPos.height
            }
        }, '<')
        .to(borderTopNode, {
            duration: 0.5,
            attr: {
                'x2': rectPos.x + rectPos.width
            }
        })
        .to(borderBottomNode, {
            duration: 0.5,
            attr: {
                'x2': rectPos.x + rectPos.width
            }
        }, '<')
        .to(borderRightNode, {
            duration: 0.2,
            attr: {
                'y2': rectPos.y + rectPos.height
            }
        });

    return ({ borderTm, borderGroup });
}

// /**
//  * 
//  * @param {{borderTm: gsap.core.Timeline}}  borderTm
// **/
// export function resetBorder({ borderTm, borderGroup }, id) {
//     borderTm.vars.onReverseComplete = () => {
//         id = id.split(' ').join('.');
//         console.log(id);
//         let res = document.querySelector(`.${id}`);
//         res.remove();
//     };

//     borderTm.reverse();
// }

/**
 * 
 * @param {SVGRectElement} rect
 * @param {HTMLDivElement} rect
 */
export function makePositionActive(rect, divContainer, nameNode) {
    let tm = gsap.timeline();

    tm.to(rect, {
        duration: 0.5,
        fill: '#dadada'
    }, 0);

    tm.to(divContainer, {
        duration: 0.5,
        color: '#222222'
    }, 0);

    tm.to(nameNode, {
        duration: 0.5,
        fill: '#222222'
    }, 0);

    return tm;
}



/**
 * 
 * @param {SVGGElement} activeGroup 
 * @param {() => void} onAnimationComplete 
 */
export function showInformationContainer(activeGroup, onAnimationComplete) {
    const groupPos = activeGroup.querySelector('rect').getBoundingClientRect();
    const borderContainer = document.querySelector('#experience__section .border__container');
    const isOnLeft = groupPos.x > (window.innerWidth / 2) ? false : true;

    const rect = document.createElement('div');
    rect.setAttribute('id', 'position-content-container')
    rect.classList.add('description-container');
    borderContainer.append(rect);

    let style = {
        top: `${groupPos.top - 182}px`,
        left: `${groupPos.left - 52}px`,
        width: `${groupPos.width + 30}px`,
        height: `${groupPos.height}px`
    };

    const tm = gsap.timeline();

    if (isOnLeft) {
        tm.fromTo(
            rect,
            {
                duration: 0,
                height: 0,
                left: 'inherit',
                right: '0%',
                top: '5%',
                width: style.width,
            },
            {
                duration: 1,
                height: '95%',
                onComplete: onAnimationComplete
            }
        );
    } else {
        tm.fromTo(
            rect,
            {
                duration: 0,
                top: '5%',
                left: '5%',
                width: style.width,
                height: 0,
            },
            {
                duration: 2,
                height: '95%',
                ease: Power1.easeInOut,
                onComplete: onAnimationComplete
            }
        );
    }


    return tm;
}


/**
 * 
 * @param {{
  *  name: string;
  *  pos: string;
  *  shortDescription: string;
  *  fullDescription: {
  *     projectDesc: string;
  *      roleDescription: string;
  *  };
  * }} data 
  * @param {string} companyName
 */
export function displayPositionInformation(data, companyName) {
    /**
    * @type {HTMLTemplateElement}
    */
    const template = document.querySelector('.experience-template').content;
    const companyDescription = template.querySelector(`.company-description .${companyName}`)
    const contentContainer = document.getElementById('position-content-container');
    const companyDescriptionClone = companyDescription.cloneNode(true);
    const position = template.querySelector(`[data-id="${data.name}-${companyName}"]`);
    const positionClone = position.cloneNode(true);

    companyDescriptionClone.style.padding = ('1rem 2rem 1rem 2rem');
    positionClone.style.padding = ('1rem 2rem 1rem 2rem')
    contentContainer.append(companyDescriptionClone);
    contentContainer.append(positionClone);
}


/**
 * 
 * @param {SVGGElement} activeGroup 
 */
export function showCloseIcon(activeGroup, onClick) {
    const posData = activeGroup.querySelector('rect').getBBox();
    const crossXGroup = createSvg('g')
        .attr('transform', `translate(${posData.width + posData.x - 25},${posData.y + 10})`)
        .attr('class', 'cross-group')
        .elem;

    const crossTimeLine = gsap.timeline({ onReverseComplete: () => crossXGroup.remove() });

    const crossStartPosition = 7.5;
    const lineLeft = createSvg('line')
        .attr('x1', crossStartPosition)
        .attr('x2', crossStartPosition)
        .attr('y1', crossStartPosition)
        .attr('y2', crossStartPosition)
        .attr('stroke', "#fff")
        .attr('stroke-width', 2)
        .attr('class', 'cross-line')
        .elem;

    const lineRight = lineLeft.cloneNode();
    lineLeft.setAttribute('transform', 'rotate(90)');

    const pointerRect = createSvg('rect')
        .attr('x', (15 - 25) / 2)
        .attr('y', (15 - 25) / 2)
        .attr('width', 25)
        .attr('height', 25)
        .attr('fill', 'transparent')
        .elem;


    crossXGroup.appendChild(lineLeft);
    crossXGroup.appendChild(lineRight);
    crossXGroup.appendChild(pointerRect);
    activeGroup.appendChild(crossXGroup)

    let leftAnim = crossTimeLine.to(lineLeft, {
        duration: 1,
        attr: {
            'x1': 0,
            'x2': 15,
            'y1': 0,
            'y2': 15
        }
    });

    let rightAnim = crossTimeLine.to(lineRight, {
        duration: 1,
        attr: {
            'x1': 0,
            'x2': 15,
            'y1': 0,
            'y2': 15
        }
    }, '<');

    pointerRect.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
        crossTimeLine.reverse();


    });

    return crossXGroup;
}



export function onCloseClick({ rectangleTimeLine, contentRectTimeline, onComplete }) {
    contentRectTimeline.vars.onReverseComplete = () => {
        rectangleTimeLine.reverse();
        onComplete();
        document.getElementById('position-content-container').remove();
    };

    contentRectTimeline.reverse()
}



export function drawMainComponents(data, mainCircleSizeR, svgContainer) {
    const positionsArr = data.positions.map(x => x);
    const { width, height } = svgContainer.node().getBoundingClientRect();


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
        .html((d) => `<div>${d.shortDescription}</div>`);

    subItemsG.each((sb, index, g) => {
        const div = g[index].querySelector('div');
        const divSize = div.getBoundingClientRect();
        const foreignObject = g[index].querySelector('foreignObject');
        foreignObject.setAttribute('height', divSize.height);
    });


    subItemsG.each(function (positionData, index, arr) {
        let hoverAnimationResult;
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
                hoverAnimationResult.borderTm.reverse();
            }

        });

        this.addEventListener('click', function (event) {
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
                        hoverAnimationResult.borderTm.reverse();
                        shouldStopReverseAnimation = false;
                    }
                })
            }

            showCloseIcon(this, closePositionDescription);


        })

        this.insertBefore(rect, nameNode);

    });

    return ({
        line,
        subItemsG,
        subCircles,
        mainCircle,
        mainText,
        subCirclesPositions
    });
}



export function addEventListenersToCards(subItemsG, svgContainer, line) {
    /**
   * @type {DOMRect}
   */
    const { width, height, x, y } = svgContainer.node().getBoundingClientRect();


}