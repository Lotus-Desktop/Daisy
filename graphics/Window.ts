import type * as SDL from "../../native/sdl2"
import Layout from "../app/Layout";
import BlockLayout from "../gui/Layouts/BlockLayout";
import StyleManager from "../gui/StyleManager";
import {Dimension} from "../gui";

const sdl = require_native<typeof SDL>('sdl2');

export interface WindowOptions {
    minWidth: number,
    minHeight: number,
    maxWidth: number,
    maxHeight: number,
    width: number,
    height: number,
    title: string,
    parent: Window
}

export interface DrawContext {
    drawPoint: typeof SDL.renderDrawPoint,
    setColour: typeof SDL.setRenderDrawColour,

    rootView: BlockLayout,
    window: Window,
    styleManager: StyleManager
}

export default class Window {
    static defaultOptions: WindowOptions = {
        minWidth: 240,
        minHeight: 64,
        maxWidth: Infinity,
        maxHeight: Infinity,
        title: "daisy-test",
        width: 720,
        height: 480,
        parent: null
    };

    options: WindowOptions;

    layout: BlockLayout;

    constructor(windowOptions: Partial<WindowOptions>) {
        const options: WindowOptions = Window.defaultOptions;

        for (const i in windowOptions)
            options[i] = windowOptions[i];

        this.options = options;
    }

    /**
     * Sets the layout such that it takes up the full window space.
     * @param root The layout to span the window
     */
    setRootLayout(root: Layout | Promise<Layout>): void {
        if (root instanceof Promise)
            root.then(layout => this.layout = layout);
        else
            this.layout = root;
    }

    /**
     * Get the dimensions of the window.
     * @returns Dimension Note: Only `width` and `height` are set.
     */
    getDimensions(): Dimension {
        return {
            width: this.options.width,
            height: this.options.height,
        }
    }

    /**
     * A Low level window displaying function. Should only be used by Daisy internally, although can be invoked manually.
     * Consult docs for more information
     * @param onUpdate Update function responsible for rendering the GUI widgets.
     */
    show(onUpdate: (context: DrawContext) => boolean) {
        sdl.init(sdl.initFlags.Video);
        sdl.createWindowAndRenderer(this.options.width, this.options.height, sdl.windowFlags.Resizable);
        sdl.setRenderDrawColour(0xff, 0xff, 0xff, 0xff);
        sdl.renderClear();
        sdl.renderPresent();

        let draw;

        Timing.setTimeout(draw = (function () {
            sdl.setRenderDrawColour(0xff, 0xff, 0xff, 0xff);
            sdl.renderClear();
            sdl.renderPresent();
            sdl.pollEvent();

            onUpdate(this.buildContext());

            if (sdl.getEvent().type !== sdl.Events.Quit)
                Timing.setTimeout(draw, 0);
            else
                sdl.quit();
        }).bind(this), 0);
    }

    private buildContext(): DrawContext {
        return {
            drawPoint: sdl.renderDrawPoint,
            setColour: sdl.setRenderDrawColour,
            rootView: this.layout,
            window: this,
            styleManager: new StyleManager()
        };
    }
}
