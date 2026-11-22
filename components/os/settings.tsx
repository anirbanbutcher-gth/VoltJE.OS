'use client'

import { Download, Eye, EyeOff, KeyRound, Loader2, Trash2, Upload, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label, Modal } from '@/components/os/ui'
import { toast } from '@/lib/context'
import { aiErrorMessage, generate } from '@/lib/gemini'
import { exportAllStored, importAllStored, useStored, wipeAllStored } from '@/lib/store'
import { DEFAULT_SETTINGS, type Settings } from '@/lib/types'

const MODELS = [
  { id: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite (500/day · 15 RPM · Primary Free Tier)' },
  { id: 'gemini-3.5-flash-lite', label: 'gemini-3.5-flash-lite (500/day · 15 RPM · Backup Free Tier)' },
  { id: 'gemini-3-flash', label: 'gemini-3-flash (20/day · 5 RPM · Deep Reasoning)' },
  { id: 'gemini-3.6-flash', label: 'gemini-3.6-flash (20/day · 5 RPM)' },
  { id: 'gemini-3.8-flash', label: 'gemini-3.8-flash (20/day · 5 RPM)' },
  { id: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite (Fast Legacy)' },
  { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash (Standard Legacy)' },
  { id: 'gemini-4-hydrogen', label: 'gemini-4-hydrogen (20/day · 5 RPM)' },
]

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [settings, setSettings] = useStored<Settings>('settings', DEFAULT_SETTINGS)
  const [key, setKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model || DEFAULT_SETTINGS.model)
  const [show, setShow] = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState('')
  const importer = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setKey(settings.apiKey)
    setModel(settings.model || DEFAULT_SETTINGS.model)
  }, [settings.apiKey, settings.model, open])

  const save = () => {
    setSettings({ apiKey: key.trim(), model })
    setStatus(`Saved (${model} active).`)
  }

  const quickSwitchModel = (nextModel: string) => {
    setModel(nextModel)
    setSettings({ apiKey: key.trim(), model: nextModel })
    setStatus(`Switched active model to ${nextModel}.`)
  }

  const test = async () => {
    setSettings({ apiKey: key.trim(), model })
    setTesting(true)
    setStatus('')
    try {
      await generate({ contents: [{ role: 'user', parts: [{ text: 'Reply with the single word: OK' }] }] })
      setStatus(`Connection works on ${model}.`)
    } catch (error) {
      setStatus(aiErrorMessage(error))
    } finally {
      setTesting(false)
    }
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exportAllStored(), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `volt-os-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importData = async (file?: File) => {
    if (!file) return
    try {
      importAllStored(JSON.parse(await file.text()))
      toast('Backup restored.')
    } catch {
      toast('That file is not a valid Volt OS backup.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key">Gemini API key</Label>
          <div className="flex gap-2">
            <input
              id="api-key"
              type={show ? 'text' : 'password'}
              autoComplete="off"
              spellCheck={false}
              className="field font-mono"
              placeholder="AIza…"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide key' : 'Show key'}
            >
              {show ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-pretty">
            Stored only in this browser&apos;s localStorage and sent directly to Google. Get a key from{' '}
            <a
              className="text-primary underline"
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <select id="model" className="field" value={model} onChange={(e) => setModel(e.target.value)}>
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={model === 'gemini-3.1-flash-lite' ? 'default' : 'outline'}
              onClick={() => quickSwitchModel('gemini-3.1-flash-lite')}
              className="h-7 text-xs"
            >
              <Zap className="size-3" /> Use 3.1 Flash Lite (500/day)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={model === 'gemini-3.5-flash-lite' ? 'default' : 'outline'}
              onClick={() => quickSwitchModel('gemini-3.5-flash-lite')}
              className="h-7 text-xs"
            >
              <Zap className="size-3" /> Use 3.5 Flash Lite (500/day)
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save}>
            <KeyRound /> Save
          </Button>
          <Button variant="outline" onClick={test} disabled={!key.trim() || testing}>
            {testing && <Loader2 className="animate-spin" />} Test connection
          </Button>
        </div>

        {status && (
          <p className="text-sm" role="status">
            {status}
          </p>
        )}

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your data</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={exportData}>
              <Download /> Export backup
            </Button>
            <Button size="sm" variant="outline" onClick={() => importer.current?.click()}>
              <Upload /> Import
            </Button>
            <input
              ref={importer}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => (importData(e.target.files?.[0]), (e.target.value = ''))}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (window.confirm('Erase all study data? Your API key is kept.')) {
                  wipeAllStored(['settings', 'theme'])
                  toast('All study data erased.')
                }
              }}
            >
              <Trash2 /> Erase data
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}