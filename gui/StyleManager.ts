import {Dimension} from "./index";

export class StyleSheet {
    get margin(): Dimension {
        return {
            x: 0,
            x2: 0,
            y: 0,
            y2: 0,
            w: 0,
            h: 0
        }
    }
}

export default class StyleManager {
    loadStyleSheet(selector: string): StyleSheet {
        return new StyleSheet();
    }
}
