export interface ILocation {
  id: string | undefined,
  provinsi: string | undefined,
  total_relawan: number | undefined,
  projection_config: {
    rotate: number[],
    center: number[],
    scale: number
  } | undefined
}