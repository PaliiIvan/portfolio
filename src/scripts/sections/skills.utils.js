import * as D3 from "d3";
import { index, transition } from "d3";
import gsap from "gsap";

/**
 *
 * @param {*} nodes
 * @param {*} height
 * @returns {D3.Transition<HTMLElement, any, null, undefined>}
 */
export function animateBuildingBlocks(nodes, height, onEndCallback) {
  const nodesBig = nodes.filter((data) => data.width === 250);
  const nodesMid = nodes.filter((data) => data.height == 120);
  const buildingTransition = D3.transition("tr").duration(1000);

  const maxInColBig = height / 250;
  const maxInColSmall = height / 120;

  const coordBig = [];
  const coordSmall = [];
  let iterator = 0;

  loop: for (
    let xIteration = 0;
    xIteration < Math.ceil(nodesBig.size() / maxInColBig);
    xIteration++
  ) {
    for (let yIteration = 0; yIteration < maxInColBig - 1; yIteration++) {
      const recPosition = {
        x: xIteration * 260 + 10,
        y: yIteration * 260 + 10,
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
    xIteration < Math.ceil(nodesMid.size() / maxInColSmall) * 2;
    xIteration++
  ) {
    for (let yIteration = 0; yIteration < maxInColSmall - 1; yIteration++) {
      const recPosition1 = {
        x: lastPosition.x + xIteration * 130,
        y: lastPosition.y + 250 + yIteration * 130 + 10,
      };
      const recPosition2 = {
        x: lastPosition.x + (xIteration + 1) * 130,
        y: lastPosition.y + 250 + yIteration * 130 + 10,
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
      (d, i) => `translate(${coordBig[i].x}, ${coordBig[i].y})`
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
      (d, i) => `translate(${coordSmall[i].x}, ${coordSmall[i].y})`
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
 * @type {{
 * lineContainer: D3.Selection
 * lineLeft: D3.Selection
 * lineRight: D3.Selection
 * }}
 */
var prevNode = {
  lineContainer: null,
  lineLeft: null,
  lineRight: null,
};

/**
 *
 * @param {HTMLElement} node
 * @param {(event: MouseEvent) => void} onClick
 */
export async function createCrossIcon(node, onClick) {
  if (prevNode.lineContainer) {
    prevNode.lineLeft
      .transition()
      .duration(500)
      .attr("x1", "90%")
      .attr("x2", "90%")
      .end()
      .catch(() => {
        console.log("transition canceled", 118);
      });

    await prevNode.lineRight
      .transition()
      .duration(500)
      .attr("x1", "90%")
      .attr("x2", "90%")
      .end()
      .catch(() => {
        console.log("transition canceled", 126);
      });

    prevNode.lineContainer.remove();
  }

  node = D3.select(node);

  let crossTransition = D3.transition().ease(D3.easeCubicInOut).duration(500);
  let lineContainer = node
    .append("svg")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("class", "cross-icon")
    .on("click", onClick);

  let selectionArea = lineContainer
    .append("rect")
    .attr("x", "82.5%")
    .attr("y", "2.5%")
    .attr("width", "15%")
    .attr("height", "15%")
    .style("fill", "transparent")
    .style("stroke", "none");

  let lineLeft = lineContainer
    .append("line")
    .attr("x1", "90%")
    .attr("x2", "90%")
    .attr("y1", "10%")
    .attr("y2", "10%")
    .attr("transform", "rotate(-45)")
    .attr("class", "cross-line");

  let lineRight = lineLeft.clone().attr("transform", "rotate(45)");

  lineLeft
    .transition(crossTransition)
    .attr("x1", "85%")
    .attr("x2", "95%")
    .end()
    .catch(() => {
      console.log("transition canceled", 169);
    });

  lineRight
    .transition(crossTransition)
    .attr("x1", "85%")
    .attr("x2", "95%")
    .end()
    .catch(() => {
      console.log("transition canceled", 176);
    });

  prevNode = {
    lineLeft,
    lineContainer,
    lineRight,
  };
}

/**
 *
 * @param {D3.Selection} nodes
 */
export async function deselectSkill(nodes) {
  nodes
    .transition()
    .duration(1000)
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

  if (prevNode.lineContainer) {
    prevNode.lineLeft
      .transition()
      .duration(500)
      .attr("x1", "90%")
      .attr("x2", "90%")
      .end();

    try {
      await prevNode.lineRight
        .transition()
        .duration(500)
        .attr("x1", "90%")
        .attr("x2", "90%")
        .end();
    } catch (err) {
      console.log("transition canceled");
    }

    prevNode.lineContainer.remove();
  }

  nodes.nodes().forEach((elem) => elem.classList.remove("active"));
}

/**
 *
 * @param {SVGElement} selectedNode
 * @param {D3.Selection} svg
 * @param {D3.Selection} nodes
 */
export function openSkillDescription(selectedNode, svg, nodes) {
  let maxVal = 0;
  nodes.each((d) => {
    if (maxVal < d.tx) {
      if (d.ty <= 50) {
        maxVal = d.tx;
      }
    }
  });

  let svgContainer = document.getElementById("skill-description-g");
  if (svgContainer) {
    closeSkillDescription();
  }

  const groupForRect = svg.append("g").attr("id", "skill-description-g");

  const { tx, ty, width, name } = D3.select(selectedNode).datum();

  const descriptionPosition = { x: maxVal + 250 + 10, y: 10 };
  const { width: svgWidth, height: svgHeight } = svg
    .node()
    .getBoundingClientRect();

  const emptyWidth = svgWidth - descriptionPosition.x;
  const emptyHeight = svgHeight - descriptionPosition.y;

  const rec = groupForRect
    .append("rect")

    .attr("class", "skill-description")
    .attr("width", width)
    .attr("height", width)
    .attr("fill", "#dadada")
    .attr("stroke", "white")
    .attr("opacity", 0)
    .attr("x", tx)
    .attr("y", ty)
    .transition()
    .duration(500)
    .attr("opacity", 1)
    .attr("x", tx)
    .attr("y", 10)
    .transition()
    .duration(500)
    .attr("x", descriptionPosition.x)
    .attr("y", descriptionPosition.y)
    .transition()
    .duration(1000)
    .attr("width", emptyWidth - 2)
    .attr("height", emptyHeight)
    .end()
    .then(() => {
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
    })
    .catch(() => {});
}

export function closeSkillDescription() {
  const skillDescG = D3.selectAll("#skill-description-g");
  const descRect = skillDescG.select("rect");
  const currentPosition = {
    x: +descRect.node().getAttribute("x"),
    y: +descRect.node().getAttribute("y"),
  };
  const mainHtmlContainer = document.querySelector(
    ".main__draw__container .skill-description-container"
  );

  if (mainHtmlContainer) {
    gsap.to(mainHtmlContainer, { x: 1000, opacity: 0, duration: 1 });
  }

  descRect
    .transition()
    .duration(1000)
    .attr("width", 0)
    .attr("height", 0)
    // .attr('x', currentPosition.x + 1)
    // .attr('y', currentPosition.y + 4)
    .style("stroke-width", "-10px")
    .end()
    .then(() => {
      skillDescG.remove();
    })
    .catch((err, e) => {
      skillDescG.remove();
    });
}
