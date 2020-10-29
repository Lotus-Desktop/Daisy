export class StyleSheet {
    get margin() {
        return {
            north: 0,
            east: 0,
            south: 0,
            west: 0,
        }
    }
}

export default class StyleManager {
    loadStyleSheet(selector: string): StyleSheet {
        return new StyleSheet();
    }
}
