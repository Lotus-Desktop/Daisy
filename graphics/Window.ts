import type * as SDL from "../../native/sdl2"

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

    constructor(windowOptions: Partial<WindowOptions>) {
        const options: WindowOptions = Window.defaultOptions;

        for (const i in windowOptions)
            options[i] = windowOptions[i];

        this.options = options;
    }

    show(onUpdate: (context: DrawContext) => boolean) {
        sdl.init(sdl.initFlags.Video);
        sdl.createWindowAndRenderer(this.options.width, this.options.height, sdl.windowFlags.Resizable);
        sdl.setRenderDrawColour(0xff, 0xff, 0xff, 0xff);
        sdl.renderClear();
        sdl.renderPresent();

        while (sdl.getEvent().type !== sdl.Events.Quit) {
            sdl.setRenderDrawColour(0xff, 0xff, 0xff, 0xff);
            sdl.renderClear();
            sdl.renderPresent();
            sdl.pollEvent();

            onUpdate(this.buildContext());
        }

        sdl.quit();
    }

    private buildContext(): DrawContext {
        return {};
    }
}
