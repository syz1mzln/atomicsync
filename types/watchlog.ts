export type TipBarMode = 'tip' | 'return-no-watches' | 'return-one-watch' | 'return-multi-watches'

export interface Watch {
  id: string
  brand: string // from BRANDS or "Other: [free text]"
  model: string
  nickname?: string
  addedAt: number // epoch ms
}

export interface SyncLog {
  watchId: string
  syncedAt: number // epoch ms
  source?: 'ntp' | 'device'
}
