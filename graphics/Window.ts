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
    drawRect: typeof SDL.renderDrawRect,
    drawText: typeof SDL.drawText,
    fillRect: typeof SDL.renderFillRect
    setColour: typeof SDL.setRenderDrawColour,
    setTextColour: typeof SDL.setTextColour,

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
    setRootLayout(root: Layout<any> | Promise<Layout<any>>): void {
        if (root instanceof Promise || "then" in root)
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
            x: 0,
            y: 0,
            w: this.options.width,
            h: this.options.height,
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

        const openSans = sdl.loadFont("/home/jcake/.fonts/open-sans/OpenSans-Regular.ttf"); // TODO: Replace with FontLoader class
        sdl.setFont(openSans, 20);

        Timing.setTimeout(draw = (function () {
            sdl.setRenderDrawColour(0xff, 0xff, 0xff, 0xff);
            sdl.renderClear();
            sdl.pollEvent();

            onUpdate(this.buildContext());

            sdl.renderPresent();

            if (sdl.getEvent().type !== sdl.Events.Quit)
                Timing.setTimeout(draw, 0);
            else
                sdl.quit();
        }).bind(this), 1000 / 60);
    }

    private buildContext(): DrawContext {
        return {
            drawPoint: sdl.renderDrawPoint,
            drawText: sdl.drawText,
            drawRect: sdl.renderDrawRect,
            fillRect: sdl.renderFillRect,
            setColour: sdl.setRenderDrawColour,
            setTextColour: sdl.setTextColour,

            window: this,
            rootView: this.layout || null,
            styleManager: new StyleManager()
        };
    }
}
