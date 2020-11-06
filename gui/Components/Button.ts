import TextView from "./TextView";
import type {Dimension} from "../index";
import type {DrawContext} from "../../graphics";

export default class Button extends TextView {
    render(window: DrawContext, bounds: Dimension) {
        super.render(window, bounds);
    }
}
