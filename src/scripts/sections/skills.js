import { sections } from "../selection";
import * as D3 from 'd3';
import { quadtree } from "d3-quadtree";
import "../../styles/skills.scss";


const SkillsDataOptions = {
    TOP: {
        class: 'skill_lvl_1',
        width: 320,
        height: 320,
    },
    MIDDLE: {
        class: 'skill_lvl_2',
        width: 156,
        height: 156,
    },
    LOW: {
        class: 'skill_lvl_3',
        width: 74,
        height: 74,
    }
}


const SkillsData = [
    {
        name: 'React.js',
        options: SkillsDataOptions.TOP
    },
    {
        name: 'Redux',
        options: SkillsDataOptions.MIDDLE
    },
    {
        name: 'Angular',
        options: SkillsDataOptions.LOW
    }
];


var simulation;

export function init(resources) {
    const section = document.querySelector('#skills_section');
    sections.forEach(x => x.classList.remove('active'));
    section.classList.add('active');

    const svg = createSvg();








    //main__draw__container
    function createSvg() {
        const svg = D3.select('.skills__section__content')
            .append('svg')
            .attr('class', 'main__draw__container');
        const { width, height } = svg.node().getBoundingClientRect();

        const data = SkillsData.map(d => ({ ...d, x: Math.random() * width, y: Math.random() * height }));


        const g2 = svg.append('g');


        const nodes = g2.selectAll('rec')
            .data(data, d => d.id)
            .enter()
            .append('rect')
            .attr('width', d => d.options.width)
            .attr('height', d => d.options.height)
            .attr('y', d => d.y)
            .attr('x', d => d.x)
            .attr('class', d => d.options.class)

            .call(D3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
            );

        simulation = D3.forceSimulation(data)
            //.force('charge', D3.forceManyBody().strength(1))
            //.force('center', D3.forceCenter(width_2 / 2, height_2 / 2))
            .force('x', D3.forceX(width / 2))
            .force('y', D3.forceY(height / 2))
            .force('collide', forceCollide(data))
            .on('tick', (res) => {



                // let quadTree = quadtree()
                //     .x(d => d.x)
                //     .y(d => d.y)
                //     .addAll(data);

                //#region Rect
                // let rectsToDraw = [];

                // quadTree.visit((node, x0, y0, x1, y1) => {

                //     node.x0 = x0;
                //     node.y0 = y0;
                //     node.x1 = x1;
                //     node.y1 = y1;
                //     rectsToDraw.push(node);
                // });

                // g3.selectAll('*').remove();
                // g3.selectAll('.rects')
                //     .data(rectsToDraw)
                //     .join('rect')
                //     .attr('x', d => d.x0)
                //     .attr('y', d => d.y0)
                //     .attr('width', d => d.x1 - d.x0)
                //     .attr('height', d => d.y1 - d.y0)
                //     .attr('stroke-width', 1)
                //     .attr('stroke', 'white')
                //     .attr('fill', 'transparent')
                //     .attr('shape-rendering', 'crispEdges')
                //#endregion



                let i = 0;

                // while (i < data.length) {

                //     quadTree.visit(collide(data[i]));
                //     i = i + 1;
                // }

                nodes
                    .attr('y', d => d.y)
                    .attr('x', d => d.x)
                    .attr('fill', d => d.color);
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

    function collide(node) {
        return (quadNode, x1, y1, x2, y2) => {
            console.log(node);
            let updated = false;
            if (quadNode.data && (quadNode.data !== node)) {
                let pending = 20;
                let x = node.x - quadNode.data.x;
                let y = node.y - quadNode.data.y;
                let xMaxSize = pending + (node.type.width + quadNode.data.type.width) / 2;
                let yMaxSize = pending + (node.type.height + quadNode.data.type.height) / 2;

                let absX = Math.abs(x);
                let absY = Math.abs(y);


                if (absX < xMaxSize && absY < yMaxSize) {
                    let vectorLength = Math.sqrt(x * x + y * y);

                    let lXVectorLength = (absX - xMaxSize) / vectorLength;
                    let lYVectorLength = (absY - yMaxSize) / vectorLength;

                    if (Math.abs(lXVectorLength) > Math.abs(lYVectorLength)) {
                        lXVectorLength = 0;
                    } else {
                        lYVectorLength = 0;
                    }

                    node.x -= x *= lXVectorLength;
                    node.y -= y *= lYVectorLength;

                    quadNode.data.x += x;
                    quadNode.data.y += y;
                    updated = true;
                }
            }

            return updated;
        }
    }
}





/**
 * 
 * @param {{
 *   name: string;
  *  options: {
  *      class: string;
  *      width: number;
  *      height: number;
  *  };
  * }[]} nodes 
 * @returns 
 */
function forceCollide(nodes) {
    function force(alpha) {
        const quad = D3.quadtree(nodes, d => d.x, d => d.y);
        for (const node of nodes) {
            quad.visit((quadNode, x1, y1, x2, y2) => {

                if (quadNode.data && quadNode.data != node) {
                    const quadNodeData = quadNode.data;

                    const nodeXCenter = node.x + (node.options.width / 2);
                    const nodeYCenter = node.y + (node.options.height / 2);

                    const quadNodeXCenter = node.x + (quadNodeData.options.width / 2);
                    const quadNodeYCenter = node.y + (quadNodeData.options.height / 2);

                    const fullX_Width = (node.options.width + quadNodeData.options.width) / 2;
                    const fullY_Height = (node.options.height + quadNodeData.options.height) / 2;

                    const dx = nodeXCenter - quadNodeXCenter;
                    const dy = nodeYCenter - quadNodeYCenter;

                    const absDx = Math.abs(dx);
                    const absDy = Math.abs(dy);

                    const xDiff = absDx - fullX_Width;
                    const yDiff = absDy - fullY_Height;


                    if (xDiff < 0 && yDiff < 0) {
                        console.log('collision');
                    }

                }

            });
        }
    }

    return force;
}




export const Skills = { init };


// function collide(node) {
//     return (quadNode, x1, y1, x2, y2) => {
//         if (quadNode.data && (quadNode.data !== node)) {
//             let x = node.x - quadNode.data.x;
//             let y = node.y - quadNode.data.y;
//             let _2pointsDistance = Math.sqrt(x * x + y * y);
//             let radius = 15;

//             if (_2pointsDistance < radius) {
//                 _2pointsDistance = (_2pointsDistance - radius) / _2pointsDistance * .5;

//                 x = x * _2pointsDistance;
//                 y = y * _2pointsDistance;

//                 node.x -= x;
//                 node.y -= y;
//                 quadNode.data.x += x;
//                 quadNode.data.y += y;
//             }
//             //return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//         }
//     }
// }