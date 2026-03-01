'use client'

import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { BRANDS } from '@/lib/brands'
import type { Watch } from '@/types/watchlog'

interface WatchPickerProps {
  onSave: (data: Omit<Watch, 'id' | 'addedAt'>) => void
  onCancel: () => void
}

type Phase = 'brand' | 'details'

export function WatchPicker({ onSave, onCancel }: WatchPickerProps) {
  const [phase, setPhase] = useState<Phase>('brand')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [isOther, setIsOther] = useState(false)
  const [model, setModel] = useState('')
  const [nickname, setNickname] = useState('')

  const canSave = selectedBrand.trim() !== '' && model.trim() !== ''

  const handleBrandSelect = (value: string) => {
    if (value === 'Other') {
      setIsOther(true)
      setSelectedBrand('')
    } else {
      setIsOther(false)
      setSelectedBrand(value)
    }
    setPhase('details')
  }

  const handleSave = () => {
    if (!canSave) return
    const entry: Omit<Watch, 'id' | 'addedAt'> = {
      brand: selectedBrand.trim(),
      model: model.trim(),
    }
    if (nickname.trim()) entry.nickname = nickname.trim()
    onSave(entry)
  }

  if (phase === 'brand') {
    return (
      <div
        className="w-[280px]"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <Command>
          <CommandInput
            placeholder="Search brand…"
            className="text-xs"
            style={{ color: 'var(--foreground)' }}
          />
          <CommandList>
            <CommandEmpty className="text-xs py-3" style={{ color: 'var(--label-muted)' }}>
              No brand found.
            </CommandEmpty>
            <CommandGroup>
              {BRANDS.map((b) => (
                <CommandItem
                  key={b}
                  value={b}
                  onSelect={() => handleBrandSelect(b)}
                  className="text-xs font-mono cursor-pointer"
                  style={{ color: 'var(--foreground)' }}
                >
                  {b}
                </CommandItem>
              ))}
              <CommandItem
                key="Other"
                value="Other"
                onSelect={() => handleBrandSelect('Other')}
                className="text-xs font-mono cursor-pointer"
                style={{ color: 'var(--label-muted)' }}
              >
                Other
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onCancel}
            className="text-xs font-mono"
            style={{ color: 'var(--label-muted)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // phase === 'details'
  return (
    <div
      className="w-[280px] p-4 flex flex-col gap-3"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {isOther ? (
        <input
          aria-label="Brand name"
          placeholder="Brand name"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          autoFocus
          className="text-xs font-mono px-2 py-1.5 rounded border w-full outline-none"
          style={{
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
            background: 'transparent',
          }}
        />
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
            {selectedBrand}
          </span>
          <button
            onClick={() => {
              setPhase('brand')
              setSelectedBrand('')
              setIsOther(false)
            }}
            className="text-xs font-mono"
            style={{ color: 'var(--label-muted)' }}
            aria-label="Change brand"
          >
            ←
          </button>
        </div>
      )}

      <input
        aria-label="Model"
        placeholder="Model (e.g. Aqua Terra)"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        autoFocus={!isOther}
        className="text-xs font-mono px-2 py-1.5 rounded border w-full outline-none"
        style={{
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
          background: 'transparent',
        }}
      />

      <input
        aria-label="Nickname"
        placeholder="Nickname (e.g. Black Sub)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="text-xs font-mono px-2 py-1.5 rounded border w-full outline-none"
        style={{
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
          background: 'transparent',
        }}
      />

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          onClick={onCancel}
          className="text-xs font-mono"
          style={{ color: 'var(--label-muted)' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="text-xs font-mono px-3 py-1.5 rounded border"
          style={{
            color: canSave ? 'var(--label-primary)' : 'var(--label-muted)',
            borderColor: canSave ? 'var(--tip-border)' : 'var(--border)',
            opacity: canSave ? 1 : 0.5,
          }}
        >
          Save watch
        </button>
      </div>
    </div>
  )
}
