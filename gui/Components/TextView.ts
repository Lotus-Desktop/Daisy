import View from "./View";
import type {Dimension} from "../index";
import type {DrawContext} from "../../graphics";
import {Align} from "../enums";

export default class TextView extends View<{text: string, align: Align}> {
    defaultArgs(): {text: string, align: Align} {
        return {
            align: Align.BEGIN,
            text: ""
        }
    }

    destroy() {
    }

    getDimensions(): Dimension {
        return {
            w: 25,
            h: 24
        };
    }

    onPointerDown(handler: (x: number, y: number) => boolean): void {
    }

    onPointerUp(handler: () => boolean): void {
    }

    render(window: DrawContext, bounds: Dimension) {
        // console.log("Bounds", bounds, this.args.text);
        window.drawText(bounds.x, bounds.y, this.args.text);
    }

    setDimensions(dimension: Dimension) {
    }

}
