'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { WatchPicker } from './WatchPicker'
import type { Watch, SyncLog } from '@/types/watchlog'

interface WatchLogDrawerProps {
  open: boolean
  onClose: () => void
  watches: Watch[]
  syncLog: SyncLog[]
  onRemove: (id: string) => void
  onAddWatch: (data: Omit<Watch, 'id' | 'addedAt'>) => void
  onLogSync: (watchId: string) => void
}

function formatLastSet(syncedAt: number | null): string {
  if (syncedAt === null) return 'never set'
  const diffMs = Date.now() - syncedAt
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return 'set today'
  if (diffDays === 1) return 'set yesterday'
  return `set ${diffDays} days ago`
}

function getLastSyncedAt(watchId: string, syncLog: SyncLog[]): number | null {
  const entries = syncLog.filter((s) => s.watchId === watchId)
  if (entries.length === 0) return null
  return Math.max(...entries.map((s) => s.syncedAt))
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
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ borderColor: 'var(--border)' }}
    >
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
        <button
          onClick={() => onLogSync(watch.id)}
          className="text-xs font-mono mt-0.5 text-left"
          style={{ color: 'var(--label-muted)' }}
        >
          Mark as set →
        </button>
      </div>
      <button
        onClick={() => onRemove(watch.id)}
        aria-label={`Remove ${label}`}
        className="text-xs font-mono min-h-[44px] min-w-[44px] flex items-center justify-center"
        style={{ color: 'var(--label-muted)' }}
      >
        {/* Gap 1: no undo at Phase 1.5 — accepted tradeoff per PRD §8 */}×
      </button>
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
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-xs font-mono min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: 'var(--label-muted)' }}
          >
            ×
          </button>
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
                    Add your first watch below. Tap &apos;Mark as set →&apos; on each watch to
                    record when you set it.
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
              <div className="px-4 py-3">
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs font-mono"
                  style={{ color: 'var(--label-muted)' }}
                >
                  + Add a watch
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
