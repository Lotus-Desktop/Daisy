import LayoutBuilder from "../dld/LayoutBuilder";
import Window, {DrawContext, WindowOptions} from "../graphics/Window"

export interface ApplicationContext {
    layoutBuilder: LayoutBuilder,
}

export interface ApplicationPreferences {

}

export default abstract class Application {
    private preferences: ApplicationPreferences;

    private windows: Window[] = [];

    private focusedWindow: Window;

    protected constructor(preferences: ApplicationPreferences) {
        this.preferences = preferences;

        this.launchApplication().then(() => {});
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

    /**
     * Contains the main draw loop of the framework. If this function is overridden, the user has direct access to drawing APIs.
     * Consequently, GUI widgets will not be rendered, instead overriding this function opens *paint mode*
     * @param context The `DrawContext` type is set of functions relating to drawing to the current context (window).
     */
    onDraw(context: DrawContext): boolean {
        if (context.rootView)
            context.rootView.render(context, context.window.getDimensions());
        else // Show Loading Screen
            console.log("Loading App");

        return true;
    }

    private async launchApplication() {
        // Do private initialisation here
        try {
            await this.start({
                // layoutBuilder: null
                layoutBuilder: new LayoutBuilder({}),
            });

            if (this.windows.length > 0) {
                console.log("Daisy is in windowed mode");
                this.windows[0].show(context => this.onDraw(context));
            } else {
                console.log("Daisy is in command-line mode")
                // Make command-line application
            }
        } catch (err) {
            console.error("An error occurred in Initialisation");
            console.error(err);
            throw err;
        }
    }
}
