import Layout from "../../app/Layout";
import type {DrawContext} from "../../graphics";
import type {Dimension, Widget} from "../index";
import type {StyleSheet} from "../StyleManager";

/**
 * A `BlockLayout` takes only one child and aligns it within predefined bounds such that the entire child is contained within it.
 */
export default class FlexLayout extends Layout<{  }> {
    addChild(child: Widget<any>) {
        this.children.push(child);
    }

    getDimensions(): Dimension {
        const dim = this.children.map((i: Widget<any>) => i.getDimensions())
        return { // TODO: Change dimensions based on Child Requirements
            w: dim.map(i => i.w).reduce((a, i) => a + i),
            h: dim.map(i => i.h).reduce((a, i) => a + i)
        };
    }

    removeChild(child: Widget<any>) {
    }

    render(context: DrawContext, bounds: Dimension) {
        const styleSheet: StyleSheet = context.styleManager.loadStyleSheet(this.constructor.name);
        const margin = styleSheet.margin;

        // Implement Flex Layout
    }

    defaultArgs(): {} {
        return {};
    }

}
