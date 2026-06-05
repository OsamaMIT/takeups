"use client";

import type { RoomSettings } from "@/types/game";
import { TOPIC_PACKS } from "@/lib/topics";
import { Button } from "@/components/ui/Button";

export function HostSettingsPanel({
  settings,
  disabled,
  onChange
}: {
  settings: RoomSettings;
  disabled: boolean;
  onChange: (settings: Partial<RoomSettings>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <NumberSetting
          label="Writing Time"
          value={settings.writingSeconds}
          min={30}
          max={300}
          suffix="seconds"
          disabled={disabled}
          onChange={(writingSeconds) => onChange({ writingSeconds })}
        />
        <NumberSetting
          label="Voting Time"
          value={settings.votingSeconds}
          min={10}
          max={60}
          suffix="seconds"
          disabled={disabled}
          onChange={(votingSeconds) => onChange({ votingSeconds })}
        />
        <NumberSetting
          label="Defense Limit"
          value={settings.maxDefenseChars}
          min={80}
          max={280}
          suffix="characters"
          disabled={disabled}
          onChange={(maxDefenseChars) => onChange({ maxDefenseChars })}
        />
        <NumberSetting
          label="Rounds"
          value={settings.roundsToPlay ?? 0}
          min={0}
          max={12}
          suffix="0 for endless"
          disabled={disabled}
          onChange={(rounds) => onChange({ roundsToPlay: rounds === 0 ? null : rounds })}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Toggle
          label="Anonymous Voting"
          checked={settings.anonymousVoting}
          disabled={disabled}
          onChange={(anonymousVoting) => onChange({ anonymousVoting })}
        />
        <Toggle
          label="Late Join"
          checked={settings.allowLateJoin}
          disabled={disabled}
          onChange={(allowLateJoin) => onChange({ allowLateJoin })}
        />
        <Toggle
          label="Spectators"
          checked={settings.allowSpectators}
          disabled={disabled}
          onChange={(allowSpectators) => onChange({ allowSpectators })}
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
          Intensity
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["safe", "spicy", "absurd"] as const).map((intensity) => (
            <Button
              key={intensity}
              type="button"
              disabled={disabled}
              variant={settings.intensity === intensity ? "primary" : "secondary"}
              onClick={() => onChange({ intensity })}
            >
              {intensity}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
          Topic Packs
        </label>
        <div className="grid gap-2 md:grid-cols-2">
          {TOPIC_PACKS.map((pack) => {
            const checked = settings.topicPacks.includes(pack);
            return (
              <label
                key={pack}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-takeups-border bg-takeups-panel px-3 py-2 text-sm text-takeups-text"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...settings.topicPacks, pack]
                      : settings.topicPacks.filter((candidate) => candidate !== pack);
                    onChange({ topicPacks: next.length ? next : [pack] });
                  }}
                />
                {pack}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NumberSetting({
  label,
  value,
  min,
  max,
  suffix,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-md border border-takeups-border bg-takeups-panel p-3">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-takeups-muted">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-24 rounded-md border border-takeups-border bg-takeups-bg px-3 py-2 font-mono text-takeups-text outline-none focus:border-takeups-blue"
        />
        <span className="text-sm text-takeups-muted">{suffix}</span>
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  disabled,
  onChange
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-takeups-border bg-takeups-panel p-3 text-sm text-takeups-text">
      <span className="font-semibold">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}
