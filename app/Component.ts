import Layout, {Dimension} from "./Layout";
import Window from "../graphics/Window";

export default abstract class Component {
    constructor(parent: Component, layout: Layout, window: Window);
    constructor(parent: Component, layout: Layout) {

    }

    abstract render(window: Window);

    abstract destroy();

    abstract setDimensions(dimension: Dimension);

    abstract onPointerDown(handler: (x: number, y: number) => boolean): void;
    abstract onPointerUp(handler: () => boolean): void;

    abstract getDimensions(): Dimension;
}
