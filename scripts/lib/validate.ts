export function assertSourcedArray(value: unknown, label: string): void {
  if (Array.isArray(value) && value.length === 0) {
    throw new Error(`Empty SourcedNumberArray detected: ${label}`);
  }
}
