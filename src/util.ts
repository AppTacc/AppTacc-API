export function getEnumValues<T extends string | number>(e: any): T[] {
    return typeof e === 'object' ? Object.keys(e).map(key => e[key]) : [];
}