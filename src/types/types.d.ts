export type Resources = {
    name: string;
    loader();
}


export function createSvg<K extends keyof SVGElementTagNameMap>(name: K): {
    attr(atr: string, val: string): chining<K>,
    elem: SVGElementTagNameMap[K]
}


interface chining<K extends keyof SVGElementTagNameMap> {
    elem: SVGElementTagNameMap[K],
    attr(atr: string, val: string): chining<K>
}