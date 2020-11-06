import Component from "../../app/Component";

/**
 * A `View` object is a generic wrapper element designed to act as a base class for various view functions such as widgets.
 * It cannot be instantiated directly, as there is no way to control what is rendered
 */
export default abstract class View<Args extends { [key: string]: string | number | boolean | Function }> extends Component<Args> {
    // Add functions specifically for generic widgets here
}
