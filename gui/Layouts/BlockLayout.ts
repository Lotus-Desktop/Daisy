import Layout from "../../app/Layout";
import Component from "../../app/Component";
import {DrawContext} from "../../graphics";
import {Dimension} from "../index";
import {StyleSheet} from "../StyleManager";

/**
 * A `BlockLayout` takes only one child and aligns it within predefined bounds such that the entire child is contained within it.
 */
export default class BlockLayout extends Layout {
    addChild(child: Component | Layout) {
        this.children[0] = child
    }

    getDimensions(): Dimension {
        const dim = this.children.map((i: Component | Layout) => i.getDimensions())
        return {
            width: dim.map(i => i.width).reduce((a, i) => a + i),
            height: dim.map(i => i.height).reduce((a, i) => a + i)
        };
    }

    removeChild(child: Component | Layout) {
    }

    render(context: DrawContext, bounds: Dimension) {
        const styleSheet: StyleSheet = context.styleManager.loadStyleSheet(this.constructor.name);
        const margin = styleSheet.margin;
        const child_bounds = {
            north: bounds.north + margin.north,
            south: bounds.south + margin.south,
            east: bounds.east + margin.east,
            west: bounds.west + margin.west,
            width: bounds.width - (margin.east - margin.west),
            height: bounds.height - (margin.south - margin.north)
        };

        if (this.children[0] instanceof Layout)
            this.children[0].render(context, child_bounds);
        else
            this.children[0].render(context, child_bounds);
    }

}
