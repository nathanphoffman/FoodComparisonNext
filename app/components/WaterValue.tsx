export function WaterValue({ value }: { value: number }) {
  const color = value < 2000 ? 'text-sky-600' : value < 8000 ? 'text-amber-600' : 'text-red-600'
  return <span className={color}>{value.toLocaleString()}</span>
}
