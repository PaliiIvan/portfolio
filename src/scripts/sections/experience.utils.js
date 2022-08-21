import gsap, { Power1 } from "gsap";
import * as d3 from "d3";
import { createSvg, pxToRem, remToPx, toRemStr } from "../helpers";
/**
 * @param {SVGRectElement} currentG
 * @param {d3.Selection<SVGCircleElement>} circle 
 * @param {d3.Selection<SVGRectElement>} block 
 * @param {d3.Selection<SVGAElement>} svgContainer 
 */
export function animateBlockHover(currentRect, svgContainer, circle, circleYPos, id) {

    circle.attr('cy', pxToRem(circleYPos));

    const circlePos = {
        x: remToPx(circle.attr('cx')),
        y: circleYPos,
        r: remToPx(circle.attr('r')),
    }


    const rectPos = currentRect.getBBox();
    const rectData = circle.datum();
    console.log(rectData);
    const borderGroup = svgContainer
        .append('g')
        .attr('class', 'border-container')
        .attr('data-identificator', `_${id}`)
        .attr('id', `_${id}`);


    const secondCircle = borderGroup
        .append('circle')
        .attr('cx', pxToRem(circlePos.x))
        .attr('cy', pxToRem(circlePos.y))
        .attr('r', pxToRem(circlePos.r))
        .attr('fill', '#dadada');

    const borderTop = borderGroup
        .append('line')
        .attr('x1', pxToRem(circlePos.x))
        .attr('y1', pxToRem(rectPos.y))
        .attr('x2', pxToRem(circlePos.x))
        .attr('y2', pxToRem(rectPos.y))
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);

    const borderBottom = borderGroup
        .append('line')
        .attr('x1', pxToRem(circlePos.x))
        .attr('x2', pxToRem(circlePos.x))
        .attr('y1', pxToRem(rectPos.y + rectPos.height))
        .attr('y2', pxToRem(rectPos.y + rectPos.height))
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);

    const borderRight = borderGroup
        .append('line')
        .attr('x1', pxToRem(rectPos.x + rectPos.width))
        .attr('y1', pxToRem(rectPos.y))
        .attr('x2', pxToRem(rectPos.x + rectPos.width))
        .attr('y2', pxToRem(rectPos.y))
        .attr('stroke', '#dadada')
        .attr('stroke-width', 2);


    const borderTopNode = borderTop.node();
    const borderBottomNode = borderBottom.node();
    const borderRightNode = borderRight.node();

    const borderTm = gsap.timeline({
        id,
        onReverseComplete: () => {
            document.querySelectorAll(`[data-identificator='_${id}']`).forEach(x => x.remove());
        }
    });

    borderTm
        .to(circle.node(), {
            duration: 0.5,
            attr: {
                'cy': pxToRem(rectPos.y)
            }
        })
        .to(secondCircle.node(), {
            duration: 0.5,
            attr: {
                'cy': pxToRem(rectPos.y + rectPos.height)
            }
        }, '<')
        .to(borderTopNode, {
            duration: 0.5,
            attr: {
                'x2': pxToRem(rectPos.x + rectPos.width)
            }
        })
        .to(borderBottomNode, {
            duration: 0.5,
            attr: {
                'x2': pxToRem(rectPos.x + rectPos.width)
            }
        }, '<')
        .to(borderRightNode, {
            duration: 0.2,
            attr: {
                'y2': pxToRem(rectPos.y + rectPos.height)
            }
        });

    return ({ borderTm, borderGroup });
}


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
export function showInformationContainer(activeGroup, isOnLeft, onAnimationComplete) {
    const groupPos = activeGroup.querySelector('rect').getBoundingClientRect();
    const borderContainer = document.querySelector('#experience__section .border__container');

    const rect = document.createElement('div');
    rect.setAttribute('id', 'position-content-container')
    rect.classList.add('description-container');
    borderContainer.append(rect);

    let style = {
        top: groupPos.top - 182,
        left: groupPos.left - 52,
        width: groupPos.width + 30,
        height: groupPos.height
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
                width: pxToRem(style.width),
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
                left: '4%',
                width: pxToRem(style.width),
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
  * @param {boolean} isOnLeft
 */
export function displayPositionInformation(data, companyName, isOnLeft) {
    /**
    * @type {HTMLTemplateElement}
    */
    const template = document.querySelector('.experience-template').content;
    const companyDescription = template.querySelector(`.company-description .${companyName}`)
    const contentContainer = document.getElementById('position-content-container');
    const contentContainerRectData = contentContainer.getBoundingClientRect();
    const companyDescriptionClone = companyDescription.cloneNode(true);
    const position = template.querySelector(`[data-id="${data.name}-${companyName}"]`);
    const positionClone = position.cloneNode(true);

    companyDescriptionClone.style.padding = ('1rem 2rem 1rem 2rem');
    positionClone.style.padding = ('1rem 2rem 1rem 2rem')
    contentContainer.append(companyDescriptionClone);
    contentContainer.append(positionClone);

    gsap.from('#position-content-container .c_name', {
        x: isOnLeft ? pxToRem(-1000) : pxToRem(2000),
        opacity: 0,
        duration: 1
    });

    gsap.from('#position-content-container .c_description', {
        x: isOnLeft ? pxToRem(-1000) : pxToRem(2000),
        opacity: 0,
        duration: 2,
        delay: 0.2
    });

    gsap.from('#position-content-container .p_name', {
        x: isOnLeft ? pxToRem(-1000) : pxToRem(2000),
        opacity: 0,
        duration: 1
    });

    gsap.from('#position-content-container .p_description', {
        x: isOnLeft ? pxToRem(-1000) : pxToRem(2000),
        opacity: 0,
        duration: 2,
        delay: 0.2
    });

    gsap.from('#position-content-container .p_responsibilities', {
        x: isOnLeft ? pxToRem(-1000) : pxToRem(2000),
        opacity: 0,
        duration: 1.5
    });

    const allLi = document.querySelectorAll('.resp-list li');

    let tmAllLi = gsap.timeline();
    const scaleAllLi = d3.scaleLinear().range([1.5, 2.5]).domain([0, allLi.length]);
    allLi.forEach((x, i) => {
        tmAllLi.from(x, {
            opacity: 0,
            x: isOnLeft ? pxToRem(-2000) : pxToRem(2000),
            duration: 1
        }, "-=0.5")
    });

    const tehStack = document.querySelectorAll('.teh-stack');
    const tehStackUl = document.querySelectorAll('.teh-stack-container span');




    // if (isOnLeft) {
    //     gsap.from(tehStack, {
    //         x: pxToRem(-1000),
    //         opacity: 0,
    //         duration: 1.5
    //     })
    // } else {
    //     gsap.from(tehStack, {
    //         x: pxToRem(2000),
    //         opacity: 0,
    //         duration: 1.5
    //     })
    // }

    let tmTehSpan = gsap.timeline();
    if (isOnLeft) {

        Array.from(tehStackUl).reverse().forEach((x, i) => {
            tmTehSpan.from(x, {
                opacity: 0,
                x: pxToRem(- 2000),
                duration: 0.8
            }, "-=0.5")
        });

        tmTehSpan.from(tehStack, {
            opacity: 0,
            x: pxToRem(- 2000),
            duration: 0.8
        }, "-=0.5")

    } else {

        tmTehSpan.from(tehStack, {
            opacity: 0,
            x: pxToRem(2000),
            duration: 0.8
        }, "-=0.5")

        tehStackUl.forEach((x, i) => {
            tmTehSpan.from(x, {
                opacity: 0,
                x: pxToRem(2000),
                duration: 0.8
            }, "-=0.5")
        });
    }

}


/**
 * 
 * @param {SVGGElement} activeGroup 
 */
export function showCloseIcon(activeGroup, onClick) {
    const posData = activeGroup.querySelector('rect').getBBox();

    const crossXGroup = createSvg('g')
        .attr('style', `transform: translate(${pxToRem(posData.width + posData.x - 25)},${pxToRem(posData.y + 10)})`)
        .attr('class', 'cross-group pointer')
        .elem;

    const crossTimeLine = gsap.timeline({ onReverseComplete: () => crossXGroup.remove() });

    const crossStartPosition = 7.5;
    const lineLeft = createSvg('line')
        .attr('x1', pxToRem(crossStartPosition))
        .attr('x2', pxToRem(crossStartPosition))
        .attr('y1', pxToRem(crossStartPosition))
        .attr('y2', pxToRem(crossStartPosition))
        .attr('stroke', "#fff")
        .attr('stroke-width', pxToRem(2))
        .attr('class', 'cross-line')
        .elem;

    const lineRight = lineLeft.cloneNode();
    lineLeft.setAttribute('transform', 'rotate(90)');

    const pointerRect = createSvg('rect')
        .attr('x', pxToRem((15 - 25) / 2))
        .attr('y', pxToRem((15 - 25) / 2))
        .attr('width', pxToRem(25))
        .attr('height', pxToRem(25))
        .attr('fill', 'transparent')
        .elem;


    crossXGroup.appendChild(lineLeft);
    crossXGroup.appendChild(lineRight);
    crossXGroup.appendChild(pointerRect);
    activeGroup.appendChild(crossXGroup)

    let leftAnim = crossTimeLine.to(lineLeft, {
        duration: 1,
        attr: {
            'x1': pxToRem(0),
            'x2': pxToRem(15),
            'y1': pxToRem(0),
            'y2': pxToRem(15)
        }
    });

    let rightAnim = crossTimeLine.to(lineRight, {
        duration: 1,
        attr: {
            'x1': pxToRem(0),
            'x2': pxToRem(15),
            'y1': pxToRem(0),
            'y2': pxToRem(15)
        }
    }, '<');

    pointerRect.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
        crossTimeLine.reverse();


    });

    return crossTimeLine;
}



export function onCloseClick({ rectangleTimeLine, contentRectTimeline, onComplete }) {
    contentRectTimeline.vars.onReverseComplete = () => {
        rectangleTimeLine.reverse();
        onComplete();

    };
    removePositionData('close');
    contentRectTimeline.reverse()

}


/**
 * 
 * @param {*} data 
 * @param {number} mainCircleSizeR 
 * @param {d3.Selection} svgContainer 
 * @returns 
 */
export function drawMainComponents(data, mainCircleSizeR, svgContainer) {
    const positionsArr = data.positions.map(x => x);
    const { width, height } = svgContainer.node().getBoundingClientRect();

    console.log(height);
    const linePosition = {
        x1: 6,
        y1: 6,
        y2: height - 10
    }

    const lineG = svgContainer.append('g')
        .attr('transform', `translate(${'1'}, ${'1'})`);

    const line = lineG.append('line')
        .attr('x1', toRemStr(linePosition.x1))
        .attr('y1', toRemStr(linePosition.y1))
        .attr('x2', toRemStr(linePosition.x1))
        .attr('y2', pxToRem(linePosition.y2))
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.2rem');

    const mainCircle = lineG.append('circle')
        .attr('cx', toRemStr(linePosition.x1))
        .attr('cy', toRemStr(linePosition.y1))
        .attr('r', pxToRem(mainCircleSizeR))
        .attr('fill', '#dadada');

    const circlesStep = Math.floor((linePosition.y2 + 50) / 4);
    let subCirclesPositions = [];

    const subCircles = lineG
        .selectAll('circles')
        .data(positionsArr)
        .enter()
        .append('circle')
        .attr('r', pxToRem(mainCircleSizeR / 2))
        .attr('cx', toRemStr(linePosition.x1))
        .attr('cy', (d, i) => {
            const yPosition = circlesStep * (i + 1);

            subCirclesPositions.push(yPosition)
            return pxToRem(yPosition);
        })
        .attr('fill', '#dadada');


    const mainText = svgContainer.append('g')
        .attr('class', 'company_title_g')
        .append('text')
        .attr('class', 'company_title')
        .attr('x', toRemStr(linePosition.x1 + 3.125))
        .text(data.company)

        .attr('y', function () {
            const { height } = this.getBoundingClientRect();
            return pxToRem(remToPx(linePosition.y1) + height / 4);
        });


    const subItemsG = svgContainer
        .selectAll('sub_g')
        .data(positionsArr)
        .enter()
        .append('g')
        .attr('class', 'position-svg-container pointer');


    subItemsG
        .attr('id', d => `${d.name}-${data.company}`)
        .append('text')
        .attr('class', 'position_title')
        .attr('x', toRemStr(linePosition.x1 + 3.125))
        .text(d => d.name)
        .attr('y', function (d, i) {
            const { height } = this.getBoundingClientRect();
            d.mainTextY = subCirclesPositions[i] + height / 4;
            return pxToRem(d.mainTextY);
        });

    subItemsG.append('foreignObject')
        .attr('class', 'desc-text')
        .attr('x', toRemStr(linePosition.x1 + 3.125))
        .attr('y', function (d, i) {
            return pxToRem(subCirclesPositions[i] + 25);
        })
        .attr('width', pxToRem(width))

        .html((d) => `<div>${d.shortDescription}</div>`);

    subItemsG.each((sb, index, g) => {
        const div = g[index].querySelector('div');
        const divSize = div.getBoundingClientRect();
        const foreignObject = g[index].querySelector('foreignObject');
        foreignObject.setAttribute('height', pxToRem(divSize.height));
        foreignObject.setAttribute('width', '80%');
    });


    let currentSelectedElemId = null;
    let lastRectAnimation = {}
    let evMap = new Map();

    subItemsG.each(function (positionData, index, arr) {
        let hoverAnimationResult;
        const id = this.getAttribute('id');

        evMap.set(id, { shouldStopReverseAnimation: false });

        const divContainer = this.querySelector('div');
        const nameNode = this.querySelector('text');
        const { x, y, height } = this.getBBox();
        const circleOldPos = subCirclesPositions[positionData.pos];
        const circle = subCircles.filter((f, i) => i === positionData.pos);
        const lineX1 = remToPx(line.attr('x1'));



        const rect = createSvg('rect')
            .attr('x', pxToRem(lineX1))
            .attr('y', pxToRem(y, -1))
            .attr('width', pxToRem(width - lineX1 - 2))
            .attr('height', pxToRem(height, 3))
            .elem;

        rect.classList.add('hover-rect');


        this.addEventListener('mouseover', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (!evMap.get(id).shouldStopReverseAnimation) {
                hoverAnimationResult = animateBlockHover(rect, svgContainer, circle, circleOldPos, id);
            }
        })

        this.addEventListener('mouseout', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (!evMap.get(id).shouldStopReverseAnimation) {
                hoverAnimationResult.borderTm.reverse();
            }

        });

        this.addEventListener('click', async function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (currentSelectedElemId == id) {
                return;
            }


            if (currentSelectedElemId) {
                console.log('someOtherAnimation');
                removePositionData();
                lastRectAnimation.borderTm.reverse();
                lastRectAnimation.rectangleActiveTml.reverse();
                lastRectAnimation.crossTimeLine.reverse();
                evMap.set(lastRectAnimation.id, { ...evMap.get(lastRectAnimation.id), shouldStopReverseAnimation: false });
            }

            currentSelectedElemId = id;

            evMap.set(id, { ...evMap.get(id), shouldStopReverseAnimation: true });
            let positionInformationTm = showInformationContainer(this, data.onLeft, () => displayPositionInformation(positionData, data.company, data.onLeft));
            let rectangleActiveTml = makePositionActive(rect, divContainer, nameNode);


            const closePositionDescription = () => {
                onCloseClick({
                    contentRectTimeline: positionInformationTm,
                    rectangleTimeLine: rectangleActiveTml,
                    onComplete: () => {
                        hoverAnimationResult.borderTm.reverse();
                        evMap.set(id, { ...evMap.get(id), shouldStopReverseAnimation: false });
                        currentSelectedElemId = null;
                    }
                })
            }

            const crossTimeLine = showCloseIcon(this, closePositionDescription);
            lastRectAnimation = {
                rectangleActiveTml,
                crossTimeLine,
                borderTm: hoverAnimationResult.borderTm,
                id
            }

        })

        this.insertBefore(rect, nameNode);

    });

    return ({
        line: line,
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

export function removePositionData(event) {
    const contentToRemove = document.querySelector('#position-content-container');

    const allDiv = contentToRemove.querySelectorAll('div');

    if (event === 'close') {
        Array.from(allDiv).reverse().forEach(x => {
            gsap.to(x, {
                opacity: 0,
                duration: 0.05
            }, '+=0.04');
        })
    }

    // contentToRemove.forEach(c => {
    let anim = gsap.to(contentToRemove, {
        delay: 1,
        duration: 0.5,
        opacity: 0,
        onComplete() {
            contentToRemove.remove();
        }
    })
    // })


}


/**
 * 
 * @param {d3.Selection} line 
 * @param {d3.Selection} circleBig 
 * @param {d3.Selection} circlesSmall 
 * @param {d3.Selection} leftRectangles 
 */
export function animateAllPageOnFirstLoad(line, circleBig, circlesSmall, leftRectangles) {
    const lineNode = line.node();
    const lineY2 = remToPx(line.attr('y2'));
    const circleCy = remToPx(circleBig.attr('cy'));
    const circleBigNode = circleBig.node();
    const circleSmallNode = circlesSmall.node();
    const leftRectsNode = leftRectangles.node();
    const mainCirclePos = circleBigNode.getBBox();

    const tm = gsap.timeline();

    tm.from(lineNode, {
        duration: 0.5,
        attr: {
            y1: pxToRem(lineY2),
        },
    });

    tm.from(circleBigNode, {
        attr: {
            cy: pxToRem(lineY2),
        },
        r: 0
    })


    circlesSmall.each(function (x, i) {
        tm
            .addLabel(`test_${i}`)
            .from(this, {
                duration: 0.5,
                attr: {
                    cy: pxToRem(lineY2),
                    r: 0,
                },
            }, `-=0.3`)
    });

    leftRectangles.each(function (x, i) {
        tm.from(this, {
            delay: 0.5,
            duration: 1,
            y: pxToRem(lineY2),
        }, `test_${i}-=0.2`);
    })
}