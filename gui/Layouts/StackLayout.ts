import Layout from "../../app/Layout";
import type {DrawContext} from "../../graphics";
import type {Dimension, Widget} from "../index";
import {Dir} from '../enums';

/**
 * A `StackLayout` aligns components along an axis such that (unless specified) there is no space between items.
 */
export default class StackLayout extends Layout<{ direction: Dir }> {
    addChild(child: Widget<any>) {
        this.children.push(child);
    }

    getDimensions(): Dimension {
        const dim = this.children.map((i: Widget<any>) => i.getDimensions())
        return {
            w: dim.map(i => i.w).reduce((a, i) => a + i),
            h: dim.map(i => i.h).reduce((a, i) => a + i)
        };
    }

    removeChild(child: Widget<any>) {
    }

    render(context: DrawContext, bounds: Dimension) {
        let dir: Dir = this.args.direction;
        const maxDim = Math.max(...this.children.map(i => {
            const dim = i.getDimensions();

            if (dir === Dir.VERTICAL) {
                if (dim.w)
                    return dim.w;
                else return dim.x2 - dim.x;
            } else {
                if (dim.h)
                    return dim.h;
                else return dim.y2 - dim.y;
            }
        }));

        if (dir === Dir.VERTICAL) {
            let totalHeight = 0;

            for (const child of this.children) {
                const dim: Dimension = child.getDimensions();

                if (dim.h)
                    totalHeight += dim.h;
                else
                    totalHeight += dim.y2 - dim.y;

                child.render(context, {
                    y: bounds.y + totalHeight,
                    x: bounds.x,
                    w: maxDim,
                    h: dim.h || dim.y2 - dim.y
                });
            }
        } else {
            let totalWidth = 0;

            for (const child of this.children) {
                const dim: Dimension = child.getDimensions();

                if (dim.h)
                    totalWidth += dim.h;
                else
                    totalWidth += dim.y2 - dim.y;

                child.render(context, {
                    x: bounds.x + totalWidth,
                    y: bounds.y,
                    w: dim.w || dim.x2 - dim.x,
                    h: maxDim
                });
            }
        }
    }

    defaultArgs(): { direction: Dir } {
        return {direction: Dir.VERTICAL};
    }

}
