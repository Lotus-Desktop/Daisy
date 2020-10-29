import {DataResource, File, PathResolver, PathType} from 'std/io';

import Layout from "../app/Layout";
import {AbstractLayout, Insert, Token, TokenType, tokenTypes} from "./AbstractLayout";

export interface BuilderOptions {

}

export default class LayoutBuilder {
    private static pathUtil = new PathResolver({root: Context.root, pathType: 1 as PathType})
    return
    layout;
    private options: BuilderOptions;

    constructor(options: BuilderOptions) {
        this.options = options;
    }

    private static parseLayout(input: string): AbstractLayout {
        console.log(input);
        const layout = new AbstractLayout();

        const tokens: Token[] = [];

        const trim = str => str.replace(/^[ \t\uFEFF\xA0]+|[ \t\uFEFF\xA0]+$/g, ''); // Modified from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim

        let source = Array.from(input);

        while (source.length > 0) {
            const accumulator = [];

            let token: Token;

            for (const char of source) {
                accumulator.push(char);

                if (accumulator.length > 0)
                    for (const matcher in tokenTypes)
                        if (tokenTypes[matcher].test(trim(accumulator.join(''))))
                            token = {
                                source: trim(accumulator.join('')),
                                type: Number(matcher) as TokenType,
                                charIndex: 0
                            };
            }

            if (token) {
                if (token.type !== TokenType.Comment)
                    tokens.push(token);
                source = Array.from(trim(source.slice(token.source.length).join('')));
            } else throw new SyntaxError(`Unrecognised ${accumulator.join('')}`)
        }

        try {
            for (const token of tokens)
                if (token.type === TokenType.LBrace)
                    layout.down();
                else if (token.type === TokenType.Newline)
                    layout.level();
                else if (token.type === TokenType.RBrace)
                    layout.up();
                else
                    layout.push(token);
        } catch (err) {
            console.error(err);
        }

        return layout;
    };

    /**
     * Parse the provided filepath as UTF8 into a `Layout`
     * @param file The path of the file to read or a `DataResource` pointing to a layout file
     * @param insert A set of variables to be used in templating of the Layout File
     * @returns Promise<Layout> The `Layout` to be used in the required context
     */
    async buildFromLayout(file: string | DataResource, insert?: Partial<Insert> | Insert | (() => (Insert | Partial<Insert>))): Promise<Layout> {
        try {
            // TODO: Convert to Layout
            let layout: AbstractLayout;

            if (typeof file === "string")
                console.log(await new File(LayoutBuilder.pathUtil.clean(file)).read());

            if (!(file instanceof DataResource))
                layout = await LayoutBuilder.parseLayout(await new File(LayoutBuilder.pathUtil.clean(file)).read() || "");
            else
                layout = LayoutBuilder.parseLayout(await file.read() || "");

            return layout.toLayout(typeof insert === "function" ? insert() : insert);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
