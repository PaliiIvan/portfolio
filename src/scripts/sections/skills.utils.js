import * as D3 from "d3";
import { index, transition } from "d3";
import gsap from "gsap";
import { createSvg, pxToRem, remToPx } from "../helpers";
import { SkillsDataOptions } from "./skills";

/**
 *
 * @param {*} nodes
 * @param {*} height
 * @returns {D3.Transition<HTMLElement, any, null, undefined>}
 */
export function animateBuildingBlocks(nodes, height, onEndCallback) {
  const nodesBig = nodes.filter((data) => data.width === SkillsDataOptions.TOP.width);
  const nodesMid = nodes.filter((data) => data.width == SkillsDataOptions.MIDDLE.width);
  const buildingTransition = D3.transition("tr").duration(1000);

  const maxInColBig = 3;
  const maxInColSmall = 6;

  const coordBig = [];
  const coordSmall = [];
  let iterator = 0;

  loop: for (
    let xIteration = 0;
    xIteration < 2;
    xIteration++
  ) {
    for (let yIteration = 0; yIteration < maxInColBig; yIteration++) {


      const startPositionY = SkillsDataOptions.TOP.r;
      const stepOnY = yIteration * SkillsDataOptions.TOP.width;

      const startPositionX = SkillsDataOptions.TOP.r;
      const stepOnX = xIteration * SkillsDataOptions.TOP.width;
      const margin = 1;



      const recPosition = {
        y: startPositionY + stepOnY + margin + (yIteration * 1.5), //+ pxToRem(10, 0, true) + pxToRem(125, 0, true),
        x: startPositionX + stepOnX + margin + (xIteration * 1.5)//+ pxToRem(10, 0, true) + pxToRem(125, 0, true),
      };
      coordBig.push(recPosition);

      iterator++;

      if (iterator === nodesBig.size()) break loop;
    }
  }

  iterator = 0;
  const lastPosition = coordBig.at(-1);

  loop: for (
    let xIteration = 0;
    xIteration < 2;
    xIteration++
  ) {
    for (let yIteration = 0; yIteration < maxInColSmall; yIteration++) {

      const marginY = lastPosition.y + SkillsDataOptions.TOP.r + SkillsDataOptions.MIDDLE.r + 1;
      const stepOnY = yIteration * SkillsDataOptions.MIDDLE.width;
      const gapOnY = yIteration * 1;

      const marginOnX = lastPosition.x - SkillsDataOptions.TOP.r + SkillsDataOptions.MIDDLE.r;

      const recPosition1 = {
        x: marginOnX, //+ SkillsDataOptions.TOP.r + SkillsDataOptions.MIDDLE.r,
        y: marginY + gapOnY + stepOnY
      };
      const recPosition2 = {
        x: marginOnX + SkillsDataOptions.MIDDLE.width + 0.5, //+ SkillsDataOptions.TOP.r + SkillsDataOptions.MIDDLE.r,
        y: marginY + gapOnY + stepOnY
      };

      coordSmall.push(recPosition1);
      coordSmall.push(recPosition2);

      iterator++;
      if (iterator >= nodesMid.size() / 2) break loop;
    }
  }

  nodesBig
    .transition(buildingTransition)
    .attr(
      "transform",
      (d, i) => `translate(${remToPx(coordBig[i].x)}, ${remToPx(coordBig[i].y)})`
    )
    .each((dat, i) => {
      (dat.tx = coordBig[i].x), (dat.ty = coordBig[i].y);
    });

  nodesBig
    .selectAll("rect")
    .attr("transform-origin", "125px 125px")
    .transition(buildingTransition)

    .attrTween("transform", () => {
      let i = D3.interpolate(0, 90);
      return (t) => `rotate(${i(t)})`;
    });

  nodesMid
    .transition(buildingTransition)
    .attr(
      "transform",
      (d, i) => `translate(${remToPx(coordSmall[i].x)}, ${remToPx(coordSmall[i].y)})`
    )
    .each((dat, i) => {
      (dat.tx = coordSmall[i].x), (dat.ty = coordSmall[i].y);
    });

  nodesMid
    .selectAll("rect")
    .attr("transform-origin", "60px 60px")
    .transition(buildingTransition)

    .attrTween("transform", () => {
      let i = D3.interpolate(0, 90);
      return (t) => `rotate(${i(t)})`;
    })
    .end()
    .then(() => onEndCallback());

  return transition;
}


/**
 *
 * @param {HTMLElement} node
 * @param {(event: MouseEvent) => void} onClick
 */
export async function createCrossIcon(node, onClick) {
  const contentContainer = document.querySelector('.skill');

  const divForCross = document.createElement('div');
  divForCross.classList.add('cross-icon');
  const svg = createSvg('svg').attr('width', '1em').attr('height', '1em').elem;

  const g = createSvg('g').elem;
  const lineLeft = createSvg('line');


  lineLeft
    .attr('x1', 0)
    .attr('x2', '1em')
    .attr('y1', 0)
    .attr('y2', '1em')
    .attr('stroke-width', '0.07em')
    .attr('class', 'cross-line');

  const lineRight = lineLeft.elem.cloneNode(true);

  lineRight
    .setAttribute('transform', 'rotate(90)');

  let ll = gsap.fromTo(lineLeft.elem, {
    attr: {
      x1: '0.5em',
      x2: '0.5em',
      y1: '0.5em',
      y2: '0.5em',
    }
  }, {
    attr: {
      x1: '0em',
      x2: '1em',
      y1: '0em',
      y2: '1em',
    },
    duration: 0.5,
  });

  let lr = gsap.fromTo(lineRight, {
    attr: {
      x1: '0.5em',
      x2: '0.5em',
      y1: '0.5em',
      y2: '0.5em',
    }
  }, {
    attr: {
      x1: '0em',
      x2: '1em',
      y1: '0em',
      y2: '1em',
    },
    duration: 0.5,
  });



  g.appendChild(lineLeft.elem);
  g.appendChild(lineRight);
  svg.appendChild(g);
  divForCross.append(svg);
  contentContainer.append(divForCross);

  divForCross.addEventListener('click', (ev) => {
    onClick(ev);
    lr.reverse();
    ll.reverse();
  });

}

/**
 *
 * @param {D3.Selection} nodes
 */
export async function deselectSkill(nodes, simulation) {
  nodes
    .transition()
    .duration(1000)
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    .end().then(x => simulation.restart());

  nodes.nodes().forEach((elem) => elem.classList.remove("active"));
}

/**
 *
 * @param {SVGElement} selectedNode
 * @param {D3.Selection} svg
 * @param {D3.Selection} nodes
 */
export function openSkillDescription(selectedNode, svg, nodes, onAnimationEnd) {
  let maxVal = {
    xPos: 0,
    r: 0
  };

  const datArr = nodes.data();

  datArr.forEach(data => {

    if (data.tx > maxVal.xPos) {
      maxVal.xPos = data.tx + data.r;
      maxVal.r = data.r;
    }

  });

  let svgContainer = document.getElementById("skill-description-g");

  if (svgContainer) {
    closeSkillDescription();
  }

  const groupForRect = svg.append("g").attr("id", "skill-description-g");

  const { tx, ty, width, name } = D3.select(selectedNode).datum();

  const descriptionPosition = { x: remToPx(maxVal.xPos + maxVal.r), y: 10 };
  console.log(descriptionPosition);

  const { width: svgWidth, height: svgHeight } = svg
    .node()
    .getBoundingClientRect();

  const emptyWidth = svgWidth - descriptionPosition.x;
  const emptyHeight = svgHeight - descriptionPosition.y;

  const backRectangle = createSvg('rect')
    .attr("class", "skill-description")
    .attr("fill", "#dadada")
    .attr("stroke", "white")
    .attr("rx", pxToRem(emptyWidth / 2))
    .attr("ry", pxToRem(emptyHeight / 2))
    .attr("x", (svgWidth + descriptionPosition.x) / 2)
    .attr("y", emptyHeight / 2)
    .elem;

  groupForRect.node().append(backRectangle);

  const tm = gsap.timeline();

  let res = tm.to(backRectangle, {
    duration: 1,
    attr: {
      width: emptyHeight - 20,
      height: emptyHeight - 20,
      x: descriptionPosition.x / 0.7,
      y: descriptionPosition.y / 0.7
    }
  }).to(backRectangle, {
    duration: 0.5,
    attr: {
      rx: pxToRem(15),
      ry: pxToRem(15),
      width: emptyWidth - 2,
      height: emptyHeight,
      x: descriptionPosition.x,
      y: descriptionPosition.y
    },
    onComplete() {
      const skillDescContainer = groupForRect
        .append("foreignObject")
        .attr("x", descriptionPosition.x + 10)
        .attr("y", descriptionPosition.y + 10)
        .attr("width", emptyWidth - 10)
        .attr("height", emptyHeight - 10)
        .attr("class", "skill-description-container");

      /**
       * @type {HTMLTemplateElement}
       */
      const skillTemplate = document.querySelector(".skills-template");
      const skillContainer = skillTemplate.content.getElementById(name);
      skillDescContainer.node().appendChild(skillContainer.cloneNode(true));

      gsap.from(".skill .paragraph", { x: -100, opacity: 0 });
      gsap.from(".skill .paragraph-description", { x: -100, opacity: 0 });

      const subItems = document.querySelectorAll(".skill .sub-item");

      subItems.forEach((x, i) => {
        gsap.from(subItems[i], {
          y: -100,
          opacity: 0,
          duration: 0.5 + i * 0.4,
        });
      });

      onAnimationEnd();
    }
  });


  return tm;
}

/**
 * 
 * @param {gsap.core.Timeline} openDescTm 
 */
export function closeSkillDescription() {


  const skillDescG = D3.selectAll("#skill-description-g");
  const descRect = skillDescG.select("rect");
  const currentPosition = {
    x: +descRect.attr("x"),
    y: +descRect.attr("y"),
    width: +descRect.attr("width"),
    height: +descRect.attr("height"),
  };

  const mainHtmlContainer = document.querySelector(
    ".main__draw__container .skill-description-container"
  );

  let tm = gsap.timeline();
  if (mainHtmlContainer) {
    gsap.to(mainHtmlContainer, {
      x: 1000,
      opacity: 0,
      duration: 1,
    });

    // tm.to(descRect.node(), {
    //   duration: 0.3,
    //   attr: {
    //     rx: '0px',
    //     ry: '0px',
    //   }
    // });

    tm.to(descRect.node(), {
      duration: 1,
      attr: {
        width: 0,
        x: currentPosition.width + currentPosition.x + 20,
        rx: '0px',
        ry: '0px',
      },
      onComplete() {
        skillDescG.remove();
      }
    });
  }
}


/**
 * 
 * @param {SVGElement} container 
 */
export function addGradient(container) {

  const g = createSvg('g').elem;
  g.innerHTML = `
  <linearGradient id="skill_gradient" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
    <stop stop-color="#3B3B3B" />
    <stop offset="1" stop-color="#2e2a5b" />
  </linearGradient>
  `

  container.append(g);

}