import Component from "./Component";

/**
 * if both south and height are provided, the renderer will use those coordinates as rendering points and the width and height to scale the object
 */
export type Dimension = {
    north: number,
    east: number,
    south?: number,
    west?: number,
    width: number,
    height: number
};

export default abstract class Layout {
    private children: Set<Component>;

    abstract addChild(child: Component);
    abstract removeChild(child: Component);

    abstract getDimension(): Dimension;

    abstract renderChildren();
}
