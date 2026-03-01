'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { WatchPicker } from './WatchPicker'
import type { Watch, SyncLog } from '@/types/watchlog'
import { formatLastSet } from '@/lib/date'
import { getLastSyncedAt } from '@/lib/watch-utils'

interface WatchLogDrawerProps {
  open: boolean
  onClose: () => void
  watches: Watch[]
  syncLog: SyncLog[]
  onRemove: (id: string) => void
  onAddWatch: (data: Omit<Watch, 'id' | 'addedAt'>) => void
  onLogSync: (watchId: string) => void
}

interface WatchRowProps {
  watch: Watch
  syncLog: SyncLog[]
  onRemove: (id: string) => void
  onLogSync: (watchId: string) => void
}

function WatchRow({ watch, syncLog, onRemove, onLogSync }: WatchRowProps) {
  const lastSyncedAt = getLastSyncedAt(watch.id, syncLog)
  const label = watch.nickname ?? watch.model

  return (
    <div
      className="flex flex-col px-4 py-3 border-b gap-2"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono uppercase" style={{ color: 'var(--label-muted)' }}>
            {watch.brand}
          </span>
          <span className="text-sm font-mono" style={{ color: 'var(--label-primary)' }}>
            {label}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--digit-dim, var(--label-muted))' }}
          >
            {formatLastSet(lastSyncedAt)}
          </span>
        </div>
        <button
          onClick={() => onRemove(watch.id)}
          aria-label={`Remove ${label}`}
          className="text-xs font-mono cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ color: 'var(--label-muted)' }}
        >
          {/* Gap 1: no undo at Phase 1.5 — accepted tradeoff per PRD §8 */}×
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onLogSync(watch.id)}
          className="text-xs font-mono cursor-pointer min-h-[44px]"
          style={{ color: 'var(--label-primary)' }}
        >
          Mark as set →
        </button>
      </div>
    </div>
  )
}

export function WatchLogDrawer({
  open,
  onClose,
  watches,
  syncLog,
  onRemove,
  onAddWatch,
  onLogSync,
}: WatchLogDrawerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleSave = (data: Omit<Watch, 'id' | 'addedAt'>) => {
    onAddWatch(data)
    setShowPicker(false)
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" showCloseButton={false} className="w-[320px] p-0 flex flex-col">
        <SheetHeader
          className="px-4 py-3 border-b flex-row items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <SheetTitle className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
            My watches
          </SheetTitle>
          <div className="flex items-center gap-1">
            {!showPicker && (
              <button
                onClick={() => setShowPicker(true)}
                aria-label="Add a watch"
                className="text-xs font-mono cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ color: 'var(--label-muted)' }}
              >
                +
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="text-xs font-mono cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ color: 'var(--label-muted)' }}
            >
              ×
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {showPicker ? (
            <div className="p-4">
              <WatchPicker onSave={handleSave} onCancel={() => setShowPicker(false)} />
            </div>
          ) : (
            <>
              {watches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center gap-4">
                  <p className="text-xs font-mono" style={{ color: 'var(--label-muted)' }}>
                    Tap &apos;+&apos; above to add your first watch. Then tap &apos;Mark as set
                    →&apos; on each watch to record when you set it.
                  </p>
                </div>
              ) : (
                <div>
                  {watches.map((watch) => (
                    <WatchRow
                      key={watch.id}
                      watch={watch}
                      syncLog={syncLog}
                      onRemove={onRemove}
                      onLogSync={onLogSync}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
