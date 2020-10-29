import Layout from "../../app/Layout";
import Component from "../../app/Component";
import {DrawContext} from "../../graphics";
import {Dimension} from "../index";

/**
 * A `StackLayout` aligns components along an axis such that (unless specified) there is no space between items.
 */
export default class StackLayout extends Layout {
    addChild(child: Component | Layout) {
    }

    getDimensions(): Dimension {
        return undefined;
    }

    removeChild(child: Component | Layout) {
    }

    render(context: DrawContext, bounds: Dimension) {
    }

}

export enum Dir {
    HORIZONTAL,
    VERTICAL
}
