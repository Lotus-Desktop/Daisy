import Component from "./Component";
import {DrawContext} from "../graphics";
import {Dimension} from "../gui";

export default abstract class Layout {
    protected children: Array<Component | Layout>;

    constructor(parent: Layout, args: Map<string, string | number | boolean | Function>) {
    }

    setHandler(handler: string, callback: () => any) {

    };

    abstract addChild(child: Component | Layout);
    abstract removeChild(child: Component | Layout);

    abstract getDimensions(): Dimension;

    abstract render(context: DrawContext, bounds: Dimension);
}
