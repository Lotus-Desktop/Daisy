import type Layout from "./Layout";
import type {DrawContext} from "../graphics";
import type {Dimension, props} from "../gui";

export default abstract class Component<Args extends props> {

    parent: Layout<any>;
    protected readonly args: Args;

    constructor(parent: Layout<any>, args: Partial<Args>) {
        this.parent = parent;

        const _args = this.defaultArgs();
        for (const i in args)
            if (args[i])
                _args[i] = args[i];

        this.args = _args as Args;
    }

    abstract defaultArgs(): Args; // is a function as default values may change contextually

    setHandler(handler: string, callback: () => any) {

    };

    abstract render(window: DrawContext, bounds: Dimension);

    abstract destroy();

    abstract setDimensions(dimension: Dimension);

    abstract onPointerDown(handler: (x: number, y: number) => boolean): void;

    abstract onPointerUp(handler: () => boolean): void;

    abstract getDimensions(): Dimension;
}
