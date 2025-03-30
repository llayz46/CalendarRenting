export type CalendarView = "month" | "week" | "day" | "agenda"

export interface CalendarEvent {
  id: string
  name: string
  description?: string
  start: Date
  end: Date
  platform: Platform
  color?: EventColor
}

export type Platform =
  | "airbnb"
  | "leboncoin"

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"
