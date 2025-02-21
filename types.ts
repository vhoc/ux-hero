export interface IAward {
  id: number
  created_at: string
  days_required: number
  name: string
  description: string
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
}

export interface ICriticalError {
  id: number
  created_at: string
  description: string
  date: string
}

const awards = [
  {
    id: 1,
    created_at: "",
    days_required: 18,
    name: "First award",
    description: "You've achieved your first award!",
    icon: "",
    icon_small: "",
  },
  {
    id: 2,
    created_at: "",
    days_required: 48,
    name: "Second award",
    description: "You've achieved your second award!",
    icon: "",
    icon_small: "",
  },
  {
    id: 3,
    created_at: "",
    days_required: 72,
    name: "Third award",
    description: "You've achieved your third award!",
    icon: "",
    icon_small: "",
  }
]

// export type TPeriod = PostgrestSingleResponse<Period> | null
