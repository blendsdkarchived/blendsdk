import { Blend, Component, IComponentConfig, IDictionary } from "@blendsdk/core";

/**
 * Interface for configuring a Path instance.
 *
 * @interface IRouterPathConfig
 * @extends {ICoreComponentConfig}
 */
export interface IRouterPathConfig extends IComponentConfig {
    /**
     * Required path template configuration
     *
     * @type {string}
     * @memberof IRouterPathConfig
     */
    path: string;
    /**
     * When `true` the regexp will be case sensitive. (default: `false`)
     *
     * @type {boolean}
     * @memberof IRouterPathConfig
     */
    sensitive?: boolean;
    /**
     * When `true` the regexp allows an optional trailing delimiter to match. (default: `false`)
     *
     * @type {boolean}
     * @memberof IRouterPathConfig
     */
    strict?: boolean;
    /**
     * When `true` the regexp will match to the end of the string. (default: `true`)
     *
     * @type {boolean}
     * @memberof IRouterPathConfig
     */
    end?: boolean;
    /**
     * When `true` the regexp will match from the beginning of the string. (default: `true`)
     *
     * @type {boolean}
     * @memberof IRouterPathConfig
     */
    start?: boolean;
    /**
     * Sets the final character for non-ending optimistic matches. (default: `/`)
     *
     * @type {string}
     * @memberof IRouterPathConfig
     */
    delimiter?: string;
    /**
     * List of valid delimiter characters. (default: `'./'`)
     *
     * @type {(string | Array<string>)}
     * @memberof IRouterPathConfig
     */
    delimiters?: string | string[];
    /**
     * List of characters that can also be "end" characters.
     *
     * @type {(string | Array<string>)}
     * @memberof IRouterPathConfig
     */
    endsWith?: string | string[];
}

/**
 * Interface describing the key/value parts
 * of a path (:bar)
 *
 * @interface Key
 */
export interface IRouterPathKey {
    /**
     * The name or the index of a key
     *
     * @type {(string | number)}
     * @memberof IRouterPathKey
     */
    name: string | number;
    /**
     * The prefix of the key (/)
     *
     * @type {string}
     * @memberof IRouterPathKey
     */
    prefix: string;
    /**
     * The delimiter of the key (/)
     *
     * @type {string}
     * @memberof IRouterPathKey
     */
    delimiter: string;
    /**
     * Indicate if the key is optional
     *
     * @type {boolean}
     * @memberof IRouterPathKey
     */
    optional: boolean;
    /**
     * Indicate if the key is repeated.
     *
     * @type {boolean}
     * @memberof IRouterPathKey
     */
    repeat: boolean;
    /**
     * The (partial)pattern to match the key
     *
     * @type {string}
     * @memberof IRouterPathKey
     */
    pattern: string;
    /**
     * Indicate of the key is partial.
     *
     * @type {boolean}
     * @memberof IRouterPathKey
     */
    partial: boolean;
}

/**
 * Optional options to be passed to the Path.generate(...)
 * method.
 *
 * @interface IRouterPathGeneratorOptions
 */
export interface IRouterPathGeneratorOptions {
    /**
     * Function for encoding input strings for output.
     */
    encode?: (value: string, token: IRouterPathKey) => string;
}

/**
 * Token typed used by the parser
 */
type Token = string | IRouterPathKey;
type PathFunction = (data?: IDictionary, options?: IRouterPathGeneratorOptions) => string;

/**
 * This class matches a url path that is based on a template and
 * provides functionality to generate a path given a key/value dictionary.
 * Path is mainly used by Blend.router.Router.
 *
 * Path is a port of path-to-regexp library to be used in BlendSDK.
 * https://github.com/pillarjs/path-to-regexp
 *
 * @export
 * @class Path
 * @extends {Blend.core.Component}
 */
export class RouterPath extends Component<IRouterPathConfig> {
    /**
     * The main path matching regexp utility.
     *
     * @protected
     * @type {RegExp}
     * @memberof Path
     */
    protected pathRegExp: RegExp;
    /**
     * Parsed tokens of the provided path.
     *
     * @protected
     * @type {Array<Token>}
     * @memberof Path
     */
    protected tokens: Token[];
    /**
     * Generated regex that is going to match
     * a path
     *
     * @protected
     * @type {RegExp}
     * @memberof Path
     */
    protected matchRe: RegExp;
    /**
     * A generated function which is used to build a path
     * based on given parameters
     *
     * @protected
     * @type {PathFunction}
     * @memberof Path
     */
    protected builder: PathFunction;

    /**
     * Creates an instance of Path.
     * @param {IRouterPathConfig} [config]
     * @memberof Path
     */
    public constructor(config?: IRouterPathConfig) {
        super(config);
        const me = this;
        me.configDefaults({
            path: undefined,
            sensitive: false,
            strict: false,
            end: true,
            start: true,
            delimiter: "/",
            delimiters: "./",
            endsWith: []
        });
        me.pathRegExp = new RegExp(
            [
                // Match escaped characters that would otherwise appear in future matches.
                // This allows the user to escape special characters that won't transform.
                "(\\\\.)",
                // Match Express-style parameters and un-named parameters with a prefix
                // and optional suffixes. Matches appear as:
                //
                // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
                // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
                "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"
            ].join("|"),
            "g"
        );
        me.tokens = me.parse(me.config.path);
        me.matchRe = me.tokensToRegExp(me.tokens);
        me.builder = me.tokensToFunction(me.tokens);
    }

    /**
     * Creates generator function from the parsed tokens
     *
     * @protected
     * @param {Array<Token>} tokens
     * @returns {PathFunction}
     * @memberof Path
     */
    protected tokensToFunction(tokens: Token[]): PathFunction {
        // Compile all the tokens into regexps.
        const matches = new Array(tokens.length);

        // Compile all the patterns before compilation.
        for (let i = 0; i < tokens.length; i++) {
            if (typeof tokens[i] === "object") {
                matches[i] = new RegExp("^(?:" + (tokens[i] as IRouterPathKey).pattern + ")$");
            }
        }

        return (data: IDictionary, options: IRouterPathGeneratorOptions) => {
            let path = "";
            const encode = (options && options.encode) || encodeURIComponent;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                if (typeof token === "string") {
                    path += token;
                    continue;
                }

                const value = data ? data[token.name] : undefined;
                let segment;

                if (Array.isArray(value)) {
                    if (!token.repeat) {
                        throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
                    }

                    if (value.length === 0) {
                        if (token.optional) {
                            continue;
                        }

                        throw new TypeError('Expected "' + token.name + '" to not be empty');
                    }

                    for (let j = 0; j < value.length; j++) {
                        segment = encode(value[j], token);

                        if (!matches[i].test(segment)) {
                            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
                        }

                        path += (j === 0 ? token.prefix : token.delimiter) + segment;
                    }

                    continue;
                }

                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                    segment = encode(String(value), token);

                    if (!matches[i].test(segment)) {
                        throw new TypeError(
                            'Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"'
                        );
                    }

                    path += token.prefix + segment;
                    continue;
                }

                if (token.optional) {
                    // Prepend partial segment prefixes.
                    if (token.partial) {
                        path += token.prefix;
                    }

                    continue;
                }

                throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? "an array" : "a string"));
            }

            return path;
        };
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @protected
     * @returns
     * @memberof Path
     */
    protected flags() {
        const me = this;
        return me.config.sensitive ? "" : "i";
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}  tokens
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */
    protected tokensToRegExp(tokens: Token[]) {
        const me = this,
            strict: boolean = me.config.strict,
            start: boolean = me.config.start !== false,
            end: boolean = me.config.end !== false,
            delimiter: string = me.escapeString(me.config.delimiter),
            delimiters: string | string[] = me.config.delimiters,
            endsWith: string = []
                .concat(me.config.endsWith)
                .map(me.escapeString)
                .concat("$")
                .join("|");

        let route = start ? "^" : "",
            isEndDelimited = tokens.length === 0;

        // Iterate over the tokens and create our regexp string.
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (typeof token === "string") {
                route += me.escapeString(token);
                isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
            } else {
                const capture = token.repeat
                    ? "(?:" + token.pattern + ")(?:" + me.escapeString(token.delimiter) + "(?:" + token.pattern + "))*"
                    : token.pattern;

                if (token.optional) {
                    if (token.partial) {
                        route += me.escapeString(token.prefix) + "(" + capture + ")?";
                    } else {
                        route += "(?:" + me.escapeString(token.prefix) + "(" + capture + "))?";
                    }
                } else {
                    route += me.escapeString(token.prefix) + "(" + capture + ")";
                }
            }
        }

        if (end) {
            if (!strict) {
                route += "(?:" + delimiter + ")?";
            }

            route += endsWith === "$" ? "$" : "(?=" + endsWith + ")";
        } else {
            if (!strict) {
                route += "(?:" + delimiter + "(?=" + endsWith + "))?";
            }
            if (!isEndDelimited) {
                route += "(?=" + delimiter + "|" + endsWith + ")";
            }
        }

        return new RegExp(route, me.flags());
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @protected
     * @param {string} group
     * @returns {string}
     * @memberof Path
     */
    protected escapeGroup(group: string): string {
        return group.replace(/([=!:$/()])/g, "\\$1");
    }

    /**
     * Escape a regular expression string.
     *
     * @protected
     * @param {string} str
     * @returns {string}
     * @memberof Path
     */
    protected escapeString(str: string): string {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }

    /**
     * Parse a string for the raw tokens.
     *
     * @protected
     * @param {string} str
     * @returns
     * @memberof Path
     */
    protected parse(str: string): Token[] {
        const me = this,
            tokens: Token[] = [],
            defaultDelimiter: string = me.config.delimiter,
            delimiters: string | string[] = me.config.delimiters;

        let index: number = 0,
            key: number = 0,
            path: string = "",
            pathEscaped: boolean = false,
            res: RegExpExecArray;

        // tslint:disable-next-line:no-conditional-assignment
        while ((res = me.pathRegExp.exec(str)) !== null) {
            const m = res[0],
                escaped = res[1],
                offset = res.index;

            path += str.slice(index, offset);
            index = offset + m.length;

            // Ignore already escaped sequences.
            if (escaped) {
                path += escaped[1];
                pathEscaped = true;
                continue;
            }

            const next = str[index],
                name = res[2],
                capture = res[3],
                group = res[4],
                modifier = res[5];

            let prev = "";

            if (!pathEscaped && path.length) {
                const k = path.length - 1;

                if (delimiters.indexOf(path[k]) > -1) {
                    prev = path[k];
                    path = path.slice(0, k);
                }
            }

            // Push the current path onto the tokens.
            if (path) {
                tokens.push(path);
                path = "";
                pathEscaped = false;
            }

            const partial = prev !== "" && next !== undefined && next !== prev,
                repeat = modifier === "+" || modifier === "*",
                optional = modifier === "?" || modifier === "*",
                delimiter = prev || defaultDelimiter,
                pattern = capture || group;

            tokens.push({
                name: name || key++,
                prefix: prev,
                delimiter,
                optional,
                repeat,
                partial,
                pattern: pattern ? me.escapeGroup(pattern) : "[^" + me.escapeString(delimiter) + "]+?"
            });
        }

        // Push any remaining characters.
        if (path || index < str.length) {
            tokens.push(path + str.substr(index));
        }

        return tokens;
    }

    /**
     * Matches a given path against the provided
     * path template.
     *
     * If the match is successful it will return an object of type T
     * or `false` of the provided path is not matched.
     *
     * @template T
     * @param {string} [path]
     * @returns {T}
     * @memberof Path
     */
    public match<T extends IDictionary>(path: string): T | null {
        const me = this,
            match = me.matchRe.exec(path);
        if (match) {
            match.shift();
            const result: IDictionary = {};
            let index: number = 0;
            me.tokens.forEach((token: IRouterPathKey) => {
                if (Blend.isObject(token) && token.name) {
                    let value =
                        match[index] === "" || match[index] === me.config.delimiter
                            ? undefined
                            : decodeURI(match[index]);
                    if (value && value.length !== 0 && value[0] === me.config.delimiter) {
                        const ar = (value as string).split("");
                        ar.shift();
                        value = ar.join("");
                    }
                    result[token.name] = value;
                    index++;
                }
            });
            return result as T;
        } else {
            return null;
        }
    }

    /**
     * Generates a path based on the given values.
     *
     * @param {IDictionary} values
     * @param {IRouterPathGeneratorOptions} [options]
     * @returns {string}
     * @memberof Path
     */
    public generate(values: IDictionary, options?: IRouterPathGeneratorOptions): string {
        return this.builder(values, options);
    }
}
