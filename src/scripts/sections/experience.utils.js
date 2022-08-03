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
    const contentContainerRectData = contentContainer.getBoundingClientRect();
    const companyDescriptionClone = companyDescription.cloneNode(true);
    const position = template.querySelector(`[data-id="${data.name}-${companyName}"]`);
    const positionClone = position.cloneNode(true);
    const isOnLeft = contentContainerRectData.x > (window.innerWidth / 2) ? false : true;

    companyDescriptionClone.style.padding = ('1rem 2rem 1rem 2rem');
    positionClone.style.padding = ('1rem 2rem 1rem 2rem')
    contentContainer.append(companyDescriptionClone);
    contentContainer.append(positionClone);

    gsap.from('#position-content-container .c_name', {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 1
    });

    gsap.from('#position-content-container .c_description', {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 2,
        delay: 0.2
    });

    gsap.from('#position-content-container .p_name', {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 1
    });

    gsap.from('#position-content-container .p_description', {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 2,
        delay: 0.2
    });

    gsap.from('#position-content-container .p_responsibilities', {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 1.5
    });

    const allLi = document.querySelectorAll('.resp-list li');

    const scaleAllLi = d3.scaleLinear().range([1.5, 2.5]).domain([0, allLi.length]);
    allLi.forEach((x, i) => {
        gsap.from(x, {
            opacity: 0,
            delay: 0.2,
            x: isOnLeft ? - 1000 : 2000,
            duration: scaleAllLi(i)
        })
    });

    const tehStack = document.querySelectorAll('.teh-stack');
    const tehStackUl = document.querySelectorAll('.teh-stack-container span');


    gsap.from(tehStack, {
        x: isOnLeft ? -1000 : 2000,
        opacity: 0,
        duration: 1.5
    })

    const scaleTehSpan = d3.scaleLinear().range([1.5, 2.5]).domain([0, tehStackUl.length]);
    if (isOnLeft) {

        Array.from(tehStackUl).reverse().forEach((x, i) => {

            gsap.from(x, {
                opacity: 0,
                delay: 0.2,
                x: isOnLeft ? - 2000 : 2000,
                duration: scaleTehSpan(i)
            })
        })
    } else {
        tehStackUl.forEach((x, i) => {
            gsap.from(x, {
                opacity: 0,
                delay: 0.2,
                x: isOnLeft ? - 2000 : 2000,
                duration: scaleTehSpan(i)
            })
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

    const circlesStep = Math.floor((linePosition.y2 + 50) / 4);
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


    subItemsG
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

        .html((d) => `<div>${d.shortDescription}</div>`);

    subItemsG.each((sb, index, g) => {
        const div = g[index].querySelector('div');
        const divSize = div.getBoundingClientRect();
        const foreignObject = g[index].querySelector('foreignObject');
        foreignObject.setAttribute('height', divSize.height);
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
        const lineX1 = line.attr('x1');



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
            let positionInformationTm = showInformationContainer(this, () => displayPositionInformation(positionData, data.company));
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
    const lineY2 = +line.attr('y2');
    const circleCy = +circleBig.attr('cy');
    const circleBigNode = circleBig.node();
    const circleSmallNode = circlesSmall.node();
    const leftRectsNode = leftRectangles.node();
    const mainCirclePos = circleBigNode.getBBox();

    const tm = gsap.timeline();

    tm.from(lineNode, {
        duration: 0.5,
        attr: {
            y1: lineY2,
        },
    });

    tm.from(circleBigNode, {
        attr: {
            cy: lineY2,
        },
        r: 0
    })


    circlesSmall.each(function (x, i) {
        tm
            .addLabel(`test_${i}`)
            .from(this, {
                duration: 0.5,
                attr: {
                    cy: lineY2,
                    r: 0,
                },
            }, `-=0.3`)
    });

    leftRectangles.each(function (x, i) {
        tm.from(this, {
            delay: 0.5,
            duration: 1,
            y: lineY2,
        }, `test_${i}-=0.2`);
    })
}