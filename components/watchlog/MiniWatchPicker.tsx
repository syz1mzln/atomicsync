'use client'

import type { Watch } from '@/types/watchlog'

interface MiniWatchPickerProps {
  watches: Watch[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (watchId: string) => void
  onAddNew: () => void
}

export function MiniWatchPicker({
  watches,
  open,
  onOpenChange,
  onSelect,
  onAddNew,
}: MiniWatchPickerProps) {
  if (!open) return null

  return (
    <div
      className="w-[240px] py-1"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {watches.map((watch) => (
        <button
          key={watch.id}
          onClick={() => {
            onSelect(watch.id)
            onOpenChange(false)
          }}
          className="flex items-center justify-between w-full px-3 py-2 text-left min-h-[44px]"
        >
          <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
            {watch.nickname ?? watch.model}
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--label-muted)' }}>
            {watch.brand.toUpperCase()}
          </span>
        </button>
      ))}
      <div className="border-t px-3 py-2" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onAddNew}
          className="text-xs font-mono w-full text-left min-h-[44px] flex items-center"
          style={{ color: 'var(--label-muted)' }}
        >
          + Add a different watch →
        </button>
      </div>
    </div>
  )
}
