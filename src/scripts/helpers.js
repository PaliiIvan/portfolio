import * as D3 from "d3";
import { moveDrugIcon } from "..";
import { PAGES, PAGESStr } from "./constants";
import { about_section, experience__section, projects__section, sections, skills_section } from "./selection";

export function iteratePage(index, goOnTop) {

    if (goOnTop) {
        if (index > 0) {
            return --index;
        } else {
            return index;
        }
    } else {
        if (index < 2) {
            return ++index;
        } else {
            return index;
        }
    }
}


export function rectCollide() {
    var nodes, sizes, masses, pending;
    var size = [0, 0];
    var strength = 1;
    var iterations = 1;

    function force() {
        var node, size, mass, xi, yi
        var i = -1
        while (++i < iterations) { iterate() }

        function iterate() {
            var j = -1
            var tree = D3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

            while (++j < nodes.length) {
                node = nodes[j]
                size = sizes[j]
                mass = masses[j]
                xi = xCenter(node)
                yi = yCenter(node)

                tree.visit(apply)
            }
        }

        function apply(quad, x0, y0, x1, y1) {
            var data = quad.data
            var xSize = pending + (size[0] + quad.size[0]) / 2
            var ySize = pending + (size[1] + quad.size[1]) / 2
            if (data) {
                if (data.index <= node.index) { return }

                var x = xi - xCenter(data)
                var y = yi - yCenter(data)
                var xd = Math.abs(x) - xSize
                var yd = Math.abs(y) - ySize

                if (xd < 0 && yd < 0) {
                    var l = Math.sqrt(x * x + y * y)
                    var m = masses[data.index] / (mass + masses[data.index])

                    if (Math.abs(xd) < Math.abs(yd)) {
                        node.vx -= (x *= xd / l * strength) * m
                        data.vx += x * (1 - m)
                    } else {
                        node.vy -= (y *= yd / l * strength) * m
                        data.vy += y * (1 - m)
                    }
                }
            }

            return x0 > xi + xSize || y0 > yi + ySize ||
                x1 < xi - xSize || y1 < yi - ySize
        }

        function prepare(quad) {
            if (quad.data) {
                quad.size = sizes[quad.data.index]
            } else {
                quad.size = [0, 0]
                var i = -1
                while (++i < 4) {
                    if (quad[i] && quad[i].size) {
                        quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                        quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
                    }
                }
            }
        }
    }

    function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2 }
    function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2 }

    force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
    }

    force.size = function (_) {
        return (arguments.length
            ? (size = typeof _ === 'function' ? _ : constant(_), force)
            : size)
    }

    force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
    }

    force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
    }

    force.pending = function (_) {
        return (arguments.length ? (pending = +_, force) : pending)
    }

    return force
}



let oldVal = 0;

/**
 * 
 * @param {number} x 
 * @param {number} maxVal 
 */
export function calculateMiddleValue(val, maxVal) {

    if (isNaN(val)) {
        return oldVal;
    }

    oldVal = val;
    if (val < 0) {
        return 0;
    }

    if (val > maxVal) {
        return maxVal;
    }

    return val;
}


export function initiateDrugEvents(simulation) {
    const pointer = document.querySelector('#mouse_pointer');

    const { width } = pointer.getBoundingClientRect();

    function dragstarted(event) {
        if (!event.active) {
            simulation.alphaTarget(0.3).restart()
        };

        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        moveDrugIcon(event.sourceEvent.clientX, event.sourceEvent.clientY, width);
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
        simulation.restart();
    }

    initiateDrugEvents.nullDrag = D3.drag()
        .on("start", null)
        .on("drag", null)
        .on("end", null);

    initiateDrugEvents.activeDrag = D3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    return D3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}


function pageInitializer() {
    let pages = new Map();


    /**
     * @param {{onInitPage: () => void, onReInitPage: () => void, page: string}}
     */
    return ({ onInitPage, onReInitPage, page }) => {
        if (pages.has(page)) {
            return onReInitPage();
        }

        pages.set(page, 'null');

        return onInitPage();
    }
}


export const PageHandel = pageInitializer();


export function Sections(name) {
    switch (name) {
        case PAGES.ABOUT:
            return about_section
        case PAGES.EXPERIENCE:
            return experience__section
        case PAGES.SKILLS:
            return skills_section
    }
}

export function showPage(page) {
    const section = Sections(page);
    sections.forEach((x) => x.classList.remove("active"));
    section.classList.add("active");
}




export function rPosition(value, attr) {

    return function () {
        /**
         * @type {HTMLBaseElement} currentElem
         */
        const currentElem = this;

        const rect = currentElem.getBoundingClientRect();

        return (rect[attr] + value);
    }

}







/**
 * 
 @type {import('../types/types').createSvg}
 */
export const createSvg = (name) => {
    let elem = document.createElementNS('http://www.w3.org/2000/svg', name);


    return ({
        elem,
        attr(qualifiedName, value) {
            this.elem.setAttribute(qualifiedName, value);
            return this;
        }
    })
}


let mainFontSize = 16;
export function pxToRem(px, additionalRem, convert) {

    if (convert) {
        return (px / mainFontSize);
    }
    return `${(px / mainFontSize) + (additionalRem || 0)}rem`;
}

export function remToPx(rem) {
    return Number.parseFloat(rem) * mainFontSize;
}

export function setMainFontSize(size) {
    mainFontSize = size;
}

export function getMainFontSize() {
    return mainFontSize;
}

export function toRemStr(val) {
    return `${val}rem`;
}



/**
 * 
 * @param {():void} cb 
 * @param {number} time 
 */
export function throttle(cb, time) {
    let timeoutId;
    return () => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            cb();
        }, time);


    }
}