import Layout from "./Layout";
import {DrawContext} from "../graphics";
import {Dimension} from "../gui";
import StyleManager from "../gui/StyleManager";

export default abstract class Component {
    constructor(parent: Layout, args: Map<string, string | number | boolean | Function>) {

    }

    setHandler(handler: string, callback: () => any) {

    };

    abstract render(window: DrawContext, bounds: Dimension);

    abstract destroy();

    abstract setDimensions(dimension: Dimension);

    abstract onPointerDown(handler: (x: number, y: number) => boolean): void;
    abstract onPointerUp(handler: () => boolean): void;

    abstract getDimensions(): Dimension;
}
