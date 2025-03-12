export interface IAward {
  id: number
  created_at: string
  days_required: number
  name: string
  description: string
  value: number
  icon?: string
  icon_small?: string
}

export interface IAwardsCheckList {
  now_playing: IAward,
  next: Array<IAward | null>
}

export interface IPeriod {
  id: number
  created_at: string
  name: string
  start_date: string
  end_date: string
  achieved_1: boolean
  achieved_2: boolean
  achieved_3: boolean
  health_1: number
  health_2: number
  health_3: number
}

export interface ISingleMonthPeriod {
  id: number
  name: string
  start_date: string
  end_date: string
}

export interface ICriticalError {
  id: number
  created_at: string
  description: string
  date: string
}

export interface IIncident {
  id: number
  created_at: string
  descripption?: string
  date: string
}

export interface IHeartsRestored {
  id: number
  month: number
  hearts_restored: boolean
}