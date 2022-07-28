import gsap from "gsap";
import * as d3 from "d3";
import { createSvg } from "../helpers";
/**
 * @param {SVGRectElement} currentG
 * @param {d3.Selection<SVGCircleElement>} circle 
 * @param {d3.Selection<SVGRectElement>} block 
 * @param {d3.Selection<SVGAElement>} svgContainer 
 */
export function animateBlockHover(currentRect, svgContainer, circle, circleYPos, id) {

    const borderTm = gsap.timeline({ id });

    circle.attr('cy', circleYPos);

    const circlePos = {
        x: +circle.attr('cx'),
        y: circleYPos,
        r: +circle.attr('r'),
    }


    const rectPos = currentRect.getBBox();

    const borderGroup = svgContainer
        .append('g')
        .attr('class', 'border-container');


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
 * @param {{borderTm: gsap.core.Timeline}}  borderTm
**/
export function resetBorder({ borderTm, borderGroup }) {


    const showCircle = () => {
        borderGroup.remove();
    }


    borderTm.vars.onReverseComplete = showCircle;
    borderTm.vars.onComplete = showCircle;
    borderTm.pause();
    borderTm.reverse();





    // circle.selection.transition()
    //     .attr('cy', circleOldPos)
    //     .attr('r', circle.r)
    //     .end()
    //     .then(() => {
    //         borderTm.reverse();
    //     })
    //     .catch(() => {
    //         //borderGroup.remove();
    //     })
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
 */
export function showInformationContainer(activeGroup) {
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
        tm.fromTo(rect, { ...style, opacity: 0 }, { duration: 2, opacity: 1, left: 'inherit', right: '0%', })
            .to(rect, { top: '5%' })
            .to(rect, { height: '95%' });
    } else {
        tm.fromTo(rect, { ...style, opacity: 0 }, { duration: 2, opacity: 1, left: '5%', })
            .to(rect, { top: '5%' })
            .to(rect, { height: '95%' });
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


    contentContainer.append(companyDescription.cloneNode(true));
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

    let leftAnim = gsap.to(lineLeft, {
        duration: 1,
        attr: {
            'x1': 0,
            'x2': 15,
            'y1': 0,
            'y2': 15
        }
    });

    let rightAnim = gsap.to(lineRight, {
        duration: 1,
        onReverseComplete: crossXGroup.remove,
        attr: {
            'x1': 0,
            'x2': 15,
            'y1': 0,
            'y2': 15
        }
    })

    pointerRect.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
        leftAnim.reverse();
        rightAnim.reverse();


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