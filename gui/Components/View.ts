import {Component, Dimension} from "../../app/index";
import Window from "../../graphics/Window";

export default class View extends Component {
    destroy() {
    }

    getDimensions(): Dimension {
        return undefined;
    }

    onPointerDown(handler: (x: number, y: number) => boolean): void {
    }

    onPointerUp(handler: () => boolean): void {
    }

    render(window: Window) {
    }

    setDimensions(dimension: Dimension) {
    }

}
