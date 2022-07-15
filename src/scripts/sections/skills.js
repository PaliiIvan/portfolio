import { sections } from "../selection";
import * as D3 from "d3";
import { calculateMiddleValue, rectCollide } from "../helpers";
import "../../styles/skills.scss";

const SkillsDataOptions = {
  TOP: {
    class: "skill_lvl_1",
    width: 250,
    height: 250,
  },
  MIDDLE: {
    class: "skill_lvl_2",
    width: 121,
    height: 121,
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

export function init(resources) {
  const section = document.querySelector("#skills_section");
  sections.forEach((x) => x.classList.remove("active"));
  section.classList.add("active");

  const svg = createSvg();

  //main__draw__container
  function createSvg() {
    const svg = D3.select(".skills__section__content")
      .append("svg")
      .attr("class", "main__draw__container");
    const { width, height } = svg.node().getBoundingClientRect();

    const data = SkillsData.map((d, index) => ({
      ...d,
      x:  Math.random() * (width - d.width),
      y:  Math.random() * (height - d.height) ,
    }));

    const g2 = svg.append("g");
    g2.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('fill' , 'white');

    const nodes = svg
      .selectAll("rec")
      .data(data, (d) => d.id)
      .enter()
      .append('g')
      .attr("class", (d) => d.class)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .call(
        D3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

      nodes.append("rect")
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
     

      nodes
      .append('text')
      .attr('x',d => d.width / 2)
      .attr('y', d => d.height / 2)
      .text(d => d.name);

    var collisionForce = rectCollide()
        .size(function (d) { return [d.width, d.width] }).pending(20);

    simulation = D3.forceSimulation(data)
      //.force('charge', D3.forceManyBody().strength(-100))
      
       .force("x", D3.forceX(width / 2).strength(0.01))
       .force("y", D3.forceY(height / 2).strength(0.01))
      .force("collide", collisionForce)
      .on("tick", (res) => {
        nodes
        .attr('transform', function(d) {
            const newX = calculateMiddleValue(d.x, width - d.width);
            const newY = calculateMiddleValue(d.y, height - d.height);


            return `translate(${newX}, ${newY})`;
        })
          .attr("fill", (d) => d.color);
      });
  }

  

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

}



export const Skills = { init };