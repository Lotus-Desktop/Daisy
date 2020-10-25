import LayoutBuilder from "../dld/LayoutBuilder";
import Layout from "./Layout";
import Window, {DrawContext, WindowOptions} from "../graphics/Window"

export interface ApplicationContext {
    layoutBuilder: LayoutBuilder,

    setRootLayout(layout: Layout | Promise<Layout>): void;
}

export interface ApplicationPreferences {

}

export default abstract class Application {
    private preferences: ApplicationPreferences;

    private windows: Window[] = [];

    private focusedWindow: Window;

    protected constructor(preferences: ApplicationPreferences) {
        this.preferences = preferences;

        this.launchApplication().then(r => {
        });
    }

    abstract async start(context: ApplicationContext);

    /**
     * Gives focus to window, moving it and any children windows forward.
     * @param window the window object to define as the primary window
     */
    focusWindow(window: Window) {
        this.focusedWindow = window; // focus the window
    }

    /**
     * Create a drawable window
     * @param options parameters to pass to the window
     * @returns The instance of Window and a window descriptor.
     */
    window(options: Partial<WindowOptions>): [Window, number] {
        const window = new Window(options);
        this.windows.push(window);
        return [window, this.windows.length - 1];
    }

    private async launchApplication() {
        // Do private initialisation here
        await this.start({
            layoutBuilder: new LayoutBuilder({}),
            /**
             * Sets the layout such that it takes up the full window space.
             * @param root The layout to span the window
             */
            setRootLayout(root: Layout | Promise<Layout>): void {
                if (root instanceof Promise)
                    root.then(() => Context.stdout.write("Done"));
                else
                    Context.stdout.write("Done");
            }
        });

        if (this.windows.length > 0)
            this.windows[0].show(function (context: DrawContext): boolean {
                return true;
            });
        else {
            console.log("Daisy is in command-line mode")
            // Make command-line application
        }
    }
}
