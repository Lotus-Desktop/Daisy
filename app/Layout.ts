import type {DrawContext} from "../graphics";
import type {Dimension, props, Widget} from "../gui";

export default abstract class Layout<Args extends props> {
    parent: Layout<any>;
    protected children: Array<Widget<Args>>;
    protected args: Args;

    constructor(parent: Layout<any>, args: Partial<Args>) {
        if (parent)
            this.parent = parent;
        this.children = [];

        const _args = this.defaultArgs();
        for (const i in args)
            if (args[i])
                _args[i] = args[i];

        this.args = _args as Args;
    }

    abstract defaultArgs(): Args; // is a function as default values may change contextually

    setHandler(handler: string, callback: () => any) {

    };

    abstract addChild(child: Widget<Args>);

    abstract removeChild(child: Widget<Args>);

    abstract getDimensions(): Dimension;

    abstract render(context: DrawContext, bounds: Dimension);
}
