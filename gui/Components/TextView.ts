import View from "./View";
import {Dimension} from "../index";
import {DrawContext} from "../../graphics";

export default class TextView extends View {
    destroy() {
    }

    getDimensions(): Dimension {
        return undefined;
    }

    onPointerDown(handler: (x: number, y: number) => boolean): void {
    }

    onPointerUp(handler: () => boolean): void {
    }

    render(window: DrawContext, bounds: Dimension) {
    }

    setDimensions(dimension: Dimension) {
    }

}
