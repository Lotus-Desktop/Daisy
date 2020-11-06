import type Layout from "../app/Layout";
import type Component from '../app/Component';
import BlockLayout from "../gui/Layouts/BlockLayout";
import StackLayout from "../gui/Layouts/StackLayout";
import FlexLayout from "../gui/Layouts/FlexLayout";
import TextView from '../gui/Components/TextView';
import Button from '../gui/Components/Button';
import type {props, Widget} from '../gui';
// noinspection ES6PreferShortImport
import {Align, Dir} from "../gui/enums";

export enum TokenType {
    Identifier,
    LParen,
    RParen,
    Variable,
    Function,
    Tag,
    Equal,
    Comma,
    String,
    Comment,
    Parent,
    LBrace,
    RBrace,
    Newline,
    Number,
    Boolean
}

export interface Token {
    source: string,
    charIndex: number,
    type: TokenType
}

export const tokenTypes: Record<TokenType, RegExp> = {
    [TokenType.Identifier]: /^[a-zA-Z$_][a-zA-Z$_0-9]*$/,
    [TokenType.LParen]: /^\($/,
    [TokenType.RParen]: /^\)$/,
    [TokenType.Variable]: /^\$[a-zA-Z$_][a-zA-Z$_0-9]*$/,
    [TokenType.Function]: /^\*[a-zA-Z$_][a-zA-Z$_0-9]*$/,
    [TokenType.Tag]: /^-[a-zA-Z$_][a-zA-Z$_0-9]*$/,
    [TokenType.Equal]: /^=$/,
    [TokenType.Comma]: /^,$/,
    [TokenType.String]: /^".[^"]*"$/,
    [TokenType.Comment]: /^#.[^\n]*\n$/,
    [TokenType.Parent]: /^!$/,
    [TokenType.LBrace]: /^{$/,
    [TokenType.RBrace]: /^}$/,
    [TokenType.Newline]: /^\n$/,
    [TokenType.Number]: /^-?\d+(\.\d+)?$/,
    [TokenType.Boolean]: /^True|False$/
};

export interface Insert {
    variables: { [key: string]: string | number | boolean },
    functions: { [key: string]: Function },
    components: {
        [identifier: string]: {
            new<Args extends props>(parent: Layout<any>, args: Args): Widget<Args>
        }
    },
    enums: {
        [key: string]: {
            [key: string]: number | string
        }
    }
}

interface BuilderLayout {
    parent: BuilderLayout,
    children: BuilderLayout[],
    constructorName: string,
    attributes: Map<string, Token>
}

export class AbstractLayout {

    private static insert: Insert = {
        components: {
            Root: BlockLayout as {new<Args extends props>(): Layout<Args>},
            BlockLayout: BlockLayout as {new<Args extends props>(): Layout<Args>},
            StackLayout: StackLayout as {new<Args extends props>(): Layout<Args>},
            FlexLayout: FlexLayout as {new<Args extends props>(): Layout<Args>},
            TextView: TextView as {new<Args extends props>(): Component<Args>},
            Button: Button as {new<Args extends props>(): Component<Args>}
        },
        enums: {
            direction: Dir,
            align: Align
        },
        functions: {},
        variables: {
            hello: "Hello World",
            button_string: "Button"
        }
    };
    private tokens: Token[] = [];
    private layout: BuilderLayout = {
        parent: undefined,
        children: [],
        constructorName: "Root",
        attributes: new Map<string, Token>()
    }

    push(token: Token): void {
        this.tokens.push(token);
    }

    down(): void {
        const layout = this.build()
        if (this.layout && layout)
            this.layout.children.push(layout);
        this.layout = layout;
    }

    up(): void {
        this.layout = this.layout.parent;
    }

    level() {
        const layout = this.build();
        if (layout)
            this.layout.children.push(layout);
    }

    fill_default(insert: Partial<Insert>): Insert {
        const out: Insert = AbstractLayout.insert;

        for (const i in insert)
            out[i] = insert[i];

        return out;
    }

    toLayout(_insert: Partial<Insert>): Layout<any> {
        const insert = this.fill_default(_insert);
        const buildArgs = function<Args extends props> (insert: Partial<Insert>, attr: Map<string, Token>, callback: (args: Partial<Args>) => Widget<Args>): Widget<Args> {
            const args: Partial<Args> = {};
            for (const i of attr.entries())
                args[i[0] as keyof Args] = (function (key: string, tok: Token): Args[keyof Args] {
                    if (tok.type === TokenType.Identifier)
                        return insert.enums[key][tok.source] as Args[keyof Args];
                    else if (tok.type === TokenType.Function)
                        return insert.functions[tok.source.substring(1)] as Args[keyof Args];
                    else if (tok.type === TokenType.Variable)
                        return insert.variables[tok.source.substring(1)] as Args[keyof Args];
                    else if (tok.type === TokenType.Number)
                        return Number(tok.source) as Args[keyof Args];
                    else if (tok.type === TokenType.Boolean)
                        return Boolean(tok.source === "True") as Args[keyof Args];
                    else
                        return String(tok.source) as Args[keyof Args];
                })(i[0], i[1]);

            return callback(args as Args);
        }

        const iterator = (builderLayout: BuilderLayout, parent: Layout<any>): Widget<any> => buildArgs(insert, builderLayout.attributes, args => {
            if (builderLayout.constructorName in insert.components) {
                const component = new insert.components[builderLayout.constructorName](parent, args);

                if (builderLayout.children.length > 0)
                    for (const child of builderLayout.children)
                        (component as Layout<any>).addChild(iterator(child, component as Layout<any>));

                return component;
            } else throw new Error(`${builderLayout.constructorName} was not registered`);
        });

        return iterator(this.layout, null) as BlockLayout
    }

    private build(): BuilderLayout {
        if (this.tokens.length > 0) {
            // const layout = new BuilderLayout(this.layout);
            const layout: BuilderLayout = {
                attributes: new Map(),
                children: [],
                constructorName: "",
                parent: this.layout
            }

            let attrName: string = "";

            const expectedTypes: TokenType[] = [TokenType.Identifier];

            for (const token of this.tokens) {
                // console.log(expectedTypes.map(i => TokenType[i]));
                if (!expectedTypes.includes(token.type))
                    throw new SyntaxError(`Unexpected Token ${token.source}; Expected ${expectedTypes.map(i => TokenType[i])}`);
                else
                    switch (token.type) {
                        case TokenType.Identifier:
                            // console.log(layout.constructorName);
                            if (!layout.constructorName) {
                                layout.constructorName = token.source;
                                expectedTypes.splice(0, expectedTypes.length, TokenType.LParen, TokenType.Identifier);
                                break;
                            } else if (!attrName) {
                                attrName = token.source;
                                expectedTypes.splice(0, expectedTypes.length, TokenType.Equal);
                                break;
                            }
                        case TokenType.String:
                        case TokenType.Number:
                        case TokenType.Variable:
                        case TokenType.Function:
                            if (attrName) {
                                layout.attributes.set(attrName, token);
                                expectedTypes.splice(0, expectedTypes.length, TokenType.Comma, TokenType.RParen, TokenType.Tag);
                                break;
                            } else throw new SyntaxError(`Unexpected Token ${token.source}; Attribute name was not specified`);
                        case TokenType.Comma:
                            attrName = "";
                            expectedTypes.splice(0, expectedTypes.length, TokenType.Identifier);
                            break;
                        case TokenType.Equal:
                            if (layout.attributes.has(attrName))
                                throw new SyntaxError(`Property ${attrName} already exists on ${layout.constructorName}`);
                            expectedTypes.splice(0, expectedTypes.length, TokenType.Identifier, TokenType.String, TokenType.Number, TokenType.Variable, TokenType.Function);
                            break;
                    }
            }

            this.tokens = [];

            return layout;
        } else
            return null;
    }
}
