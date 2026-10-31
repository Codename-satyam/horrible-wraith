// Replace {name}-style tokens in a string.
export const fill = (s = '', vars = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
