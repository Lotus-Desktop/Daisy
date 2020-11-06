import Layout from "../../app/Layout";
import type {DrawContext} from "../../graphics";
import type {Dimension, Widget} from "../index";
import type {StyleSheet} from "../StyleManager";
import {Align} from "../enums";

/**
 * A `BlockLayout` takes only one child and aligns it within predefined bounds such that the entire child is contained within it.
 */
export default class BlockLayout extends Layout<{ alignX: Align, alignY: Align }> {
    defaultArgs() {
        return {alignX: Align.CENTRE, alignY: Align.CENTRE};
    }

    addChild(child: Widget<any>) {
        this.children[0] = child;
    }

    getDimensions(): Dimension {
        if (this.children.length > 0) {
            const child = this.children[0].getDimensions();
            return {
                w: child.w,
                h: child.h,
                x: 0,
                x2: 0,
                y: 0,
                y2: 0
            };
        } else return {
            w: 0,
            h: 0
        };
    }

    removeChild(child: Widget<any>) {
    }

    render(context: DrawContext, bounds: Dimension) {
        const styleSheet: StyleSheet = context.styleManager.loadStyleSheet(this.constructor.name);
        const margin = styleSheet.margin;
        const child_bounds: Dimension = {
            x: bounds.x + margin.x,
            x2: bounds.x2 + margin.x2,
            y: bounds.y + margin.y,
            y2: bounds.y2 + margin.y2,
            w: bounds.w - (margin.x2 - margin.x),
            h: bounds.h - (margin.y2 - margin.y)
        };

        if (this.children[0] instanceof Layout)
            this.children[0].render(context, child_bounds);
        else
            this.children[0].render(context, child_bounds);
    }
}
