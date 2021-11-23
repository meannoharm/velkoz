export function isNotExist(value: any): boolean {
  return value === null || typeof(value) === 'undefined';
}
