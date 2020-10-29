import Layout from "../app/Layout";
import Component from "../app/Component";
import BlockLayout from "../gui/Layouts/BlockLayout";
import StackLayout, {Dir} from "../gui/Layouts/StackLayout";

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
    variables: {[key: string]: string | number | boolean },
    functions: {[key: string]: () => any},
    components: {
        [identifier: string]: {new(parent: Layout, args: Map<string, string | number | boolean | Function>): Component | Layout}
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

    private tokens: Token[] = [];

    private static insert: Insert = {
        components: {
            Root: BlockLayout,
            BlockLayout: BlockLayout,
            StackLayout: StackLayout
        },
        enums: {
            direction: Dir
        },
        functions: {},
        variables: {}
    };

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

    toLayout(_insert: Partial<Insert>): Layout {
        const insert = this.fill_default(_insert);
        const buildArgs = function (insert: Partial<Insert>, attr: Map<string, Token>, callback: (args: Map<string, string | number | boolean | Function>) => Component | Layout): Component | Layout {
            const args = new Map<string, string | number | boolean | Function>();
            for (const i of attr.entries())
                args.set(i[0], (function(key: string, tok: Token) {
                    if (tok.type === TokenType.Identifier)
                        return insert.variables[key][tok.source];
                    else if (tok.type === TokenType.Function)
                        return insert.functions[tok.source];
                    else if (tok.type === TokenType.Variable)
                        return insert.variables[tok.source];
                    else if (tok.type === TokenType.Number)
                        return Number(tok.source);
                    else if (tok.type === TokenType.Boolean)
                        return tok.source === "True";
                    else
                        return tok.source;
                })(i[0], i[1]));

            return callback(args);
        }
        const iterator = (builderLayout: BuilderLayout, parent: Layout): Component | Layout => buildArgs(insert, builderLayout.attributes, args => {
            if (builderLayout.constructorName in insert.components) {
                const component = new insert.components[builderLayout.constructorName](parent, args);

                if (builderLayout.children.length > 0 || component instanceof Layout)
                    for (const child of builderLayout.children)
                        (component as Layout).addChild(iterator(child, component as Layout));

                return component;
            } else throw new Error(`${builderLayout.constructorName} was not registered`);
        });

        // console.log(builderLayout.constructorName);

        return iterator(this.layout, null) as BlockLayout
    }

    private build(): BuilderLayout {
        if (this.tokens.length > 0) {
            // const layout = new BuilderLayout(this.layout);
            const layout: BuilderLayout = {
                attributes: undefined,
                children: [],
                constructorName: "BlockLayout",
                parent: this.layout
            }

            let attrName: string;

            const expectedTypes: TokenType[] = [TokenType.Identifier];

            for (const token of this.tokens) {
                if (!expectedTypes.includes(token.type))
                    throw new SyntaxError(`Unexpected Token ${token.source}`);
                else
                    switch (token.type) {
                        case TokenType.Identifier:
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
                            } else throw new SyntaxError(`Unexpected Token ${token.source}`);
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
