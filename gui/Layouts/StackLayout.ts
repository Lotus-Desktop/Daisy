import Layout, {Dimension} from "../../app/Layout";
import Component from "../../app/Component";
import Window from "../../graphics/Window";

export default class StackLayout extends Layout {
    addChild(child: Component) {
    }

    getDimension(): Dimension {
        return undefined;
    }

    removeChild(child: Component) {
    }

    renderChildren() {
    }

}
