'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CITIES, City } from '@/lib/cities'

interface TimezoneSelectorProps {
  onSelect: (city: City) => void
  trigger?: React.ReactNode
  selectedCity?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TimezoneSelector({
  onSelect,
  trigger,
  selectedCity,
  open: controlledOpen,
  onOpenChange,
}: TimezoneSelectorProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            className="text-xs font-mono px-3 py-1.5 rounded border cursor-pointer flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{
              color: 'var(--label-primary)',
              borderColor: 'var(--tip-border)',
              background: 'transparent',
            }}
          >
            + Add timezone
            <ChevronsUpDown size={12} />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <Command>
          <CommandInput
            placeholder="Search city…"
            className="text-xs"
            style={{ color: 'var(--foreground)' }}
          />
          <CommandList>
            <CommandEmpty style={{ color: 'var(--label-muted)' }} className="text-xs py-3">
              No city found.
            </CommandEmpty>
            <CommandGroup>
              {CITIES.map((c) => (
                <CommandItem
                  key={`${c.city}-${c.utcOffset}`}
                  value={`${c.city} ${c.name} ${c.utcOffset}`}
                  onSelect={() => {
                    onSelect(c)
                    setOpen(false)
                  }}
                  className="text-xs cursor-pointer"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Check
                    size={12}
                    className="mr-1"
                    style={{
                      opacity: selectedCity === c.city ? 1 : 0,
                      color: 'var(--digit-primary)',
                    }}
                  />
                  <span className="flex-1">{c.city}</span>
                  <span style={{ color: 'var(--label-muted)' }}>
                    {c.name} {c.utcOffset}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
