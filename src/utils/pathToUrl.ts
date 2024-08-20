export const pathToUrl = (path: string, params: Record<string, string>): string => {
    const url = Object.keys(params).reduce((result, param) => {
        return result.replace(`:${param}`, params[param]);
    }, path);

    return url;
};