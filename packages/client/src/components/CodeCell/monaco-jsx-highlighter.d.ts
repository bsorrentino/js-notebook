declare module "monaco-jsx-highlighter" {



export function makeGetAstPromise(parse: any, monacoEditor: any): () => Promise<any>;
export function makeParseJSXExpressionsPromise(traverse: any, getAstPromise: any, _collectJSXExpressions?: typeof collectJSXExpressions): () => Promise<any>;
export function makeJSXCommenterBundle(monaco: any, parse: any, traverse: any, monacoEditor: any, options?: {}): any[];
export function makeBabelParse(parse: any): (code: any, options?: {}) => any;
export default MonacoJSXHighlighter;

export class DecoratorMapper {}
export function collectJSXExpressions(ast: any, traverse: any, traverseOptions?: {}): any[];
/**
 * [defaultOptions description]
 */
export type options = any;

export class MonacoJSXHighlighter {
    constructor(monaco: any, parse: any, traverse: any, monacoEditor: any, options?: {});
    options: {
        parser: string;
        isHighlightGlyph: boolean;
        iShowHover: boolean;
        isUseSeparateElementStyles: boolean;
        jsxCommenter: null;
        monacoEditorManager: null;
        decoratorMapper: null;
    };
    babelParse: (code: any, options?: {}) => any;
    jsxCommenter: any;
    monacoEditorManager: any;
    parseJSXExpressionsPromise: any;
    getAstPromise: any;
    loc2Range: any;
    range2Loc: any;
    addJSXCommentCommand: any;
    decoratorMapper: DecoratorMapper;
    decoratorMapperReset: () => void;
    highlight: (ast: any, _collectJSXExpressions?: typeof collectJSXExpressions) => Promise<any>;
    highlightCode: (afterHighlight?: (ast: any) => any, onHighlightError?: (error: any) => any, getAstPromise?: any, onGetAstError?: (error: any) => any) => any;
    isHighlightBoundToModelContentChanges: () => boolean;
    highlightOnDidChangeModelContent: (debounceTime?: number, afterHighlight?: (ast: any) => any, onHighlightError?: (error: any) => any, getAstPromise?: any, onParseAstError?: (error: any) => any) => () => void;
    highLightOnDidChangeModelContent: (debounceTime?: number, afterHighlight?: (ast: any) => any, onHighlightError?: (error: any) => any, getAstPromise?: any, onParseAstError?: (error: any) => any) => () => void;
}

}