/**
 * if both south and height are provided, the renderer will use those coordinates as rendering points and the width and height to scale the object
 */
import type Component from "../app/Component";
import type Layout from "../app/Layout";

export type Dimension = {
    x?: number,
    y?: number,
    x2?: number,
    y2?: number,
    w: number,
    h: number
};

export type props = { [key: string]: string | number | boolean | Function };

export type Widget<Args extends props> = Component<Args> | Layout<Args>;

export {default as BlockLayout} from "./Layouts/BlockLayout";
export {default as StackLayout} from "./Layouts/StackLayout";
export {default as FlexLayout} from "./Layouts/FlexLayout";
export {default as Button} from "./Components/Button";
export {default as TextView} from "./Components/TextView";
export {default as View} from "./Components/View";

export * from "./Layouts/BlockLayout";
export * from "./Layouts/StackLayout";
export * from "./Layouts/FlexLayout";

export * from './enums';

// export default {
//
// }
