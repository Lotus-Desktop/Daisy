import Layout from "../../app/Layout";
import Component from "../../app/Component";
import {DrawContext} from "../../graphics";
import {Dimension} from "../index";
import {StyleSheet} from "../StyleManager";

/**
 * A `BlockLayout` takes only one child and aligns it within predefined bounds such that the entire child is contained within it.
 */
export default class FlexLayout extends Layout {
    addChild(child: Component | Layout) {
        this.children[0] = child
    }

    getDimensions(): Dimension {
        const dim = this.children.map((i: Component | Layout) => i.getDimensions())
        return { // TODO: Change dimensions based on Child Requirements
            width: dim.map(i => i.width).reduce((a, i) => a + i),
            height: dim.map(i => i.height).reduce((a, i) => a + i)
        };
    }

    removeChild(child: Component | Layout) {
    }

    render(context: DrawContext, bounds: Dimension) {
        const styleSheet: StyleSheet = context.styleManager.loadStyleSheet(this.constructor.name);
        const margin = styleSheet.margin;

        // Implement Flex Layout
    }

}
