export interface ErrorMessage {
    message: string;
    stack: Array<{
        line: number;
        column: number;
        filename: string;
    }>;
}

export function parseError(err: Error): ErrorMessage {
    // 正则图示: https://regexper.com/#%2F%28https%3F%3A%5C%2F%5C%2F%5B0-9.%3A%2Fa-zA-Z%5C-_%5D%2B%5C.js%29%3A%28%5Cd%2B%29%3A%28%5Cd%2B%29%2Fg
    const reg = /(https?:\/\/[0-9.:/a-zA-Z\-_]+\.js):(\d+):(\d+)/g;
    return {
        message: err.message,
        stack: err.stack
            ? Array.from(err.stack.matchAll(reg)).map(
                ([, filename, line, column]) => ({
                    filename,
                    line: Number(line),
                    column: Number(column),
                })
            )
            : [],
    };
}
