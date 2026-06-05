"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { MAX_CUSTOM_TOPICS } from "@/lib/constants";
import type { CustomTopic, RoomSettings } from "@/types/game";
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
  const customTopics = settings.customTopics ?? [];
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
        <div className="grid grid-cols-2 gap-2">
          {(["spicy", "absurd"] as const).map((intensity) => (
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
      <CustomTopicsSetting
        topics={customTopics}
        disabled={disabled}
        onChange={(customTopics) => onChange({ customTopics })}
      />
    </div>
  );
}

function CustomTopicsSetting({
  topics,
  disabled,
  onChange
}: {
  topics: CustomTopic[];
  disabled: boolean;
  onChange: (topics: CustomTopic[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const cleanPrompt = prompt.trim();
  const cleanSideA = sideA.trim();
  const cleanSideB = sideB.trim();
  const canAdd =
    !disabled &&
    topics.length < MAX_CUSTOM_TOPICS &&
    cleanPrompt.length >= 3 &&
    cleanSideA.length > 0 &&
    cleanSideB.length > 0;

  function addTopic() {
    if (!canAdd) return;
    onChange([
      ...topics,
      {
        id: createCustomTopicId(cleanPrompt),
        prompt: cleanPrompt.slice(0, 140),
        sideA: cleanSideA.slice(0, 120),
        sideB: cleanSideB.slice(0, 120)
      }
    ]);
    setPrompt("");
    setSideA("");
    setSideB("");
  }

  return (
    <div className="rounded-md border border-takeups-border bg-takeups-panel p-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-[0.22em] text-takeups-muted">
          Custom Topics
        </label>
        <span className="font-mono text-xs text-takeups-muted">
          {topics.length}/{MAX_CUSTOM_TOPICS}
        </span>
      </div>
      <div className="mt-3 grid gap-3">
        <input
          type="text"
          value={prompt}
          maxLength={140}
          disabled={disabled}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Debate prompt"
          className="w-full rounded-md border border-takeups-border bg-takeups-bg px-3 py-2 text-sm text-takeups-text outline-none focus:border-takeups-blue"
        />
        <div className="grid gap-2 md:grid-cols-2">
          <input
            type="text"
            value={sideA}
            maxLength={120}
            disabled={disabled}
            onChange={(event) => setSideA(event.target.value)}
            placeholder="Side A"
            className="w-full rounded-md border border-takeups-border bg-takeups-bg px-3 py-2 text-sm text-takeups-text outline-none focus:border-takeups-blue"
          />
          <input
            type="text"
            value={sideB}
            maxLength={120}
            disabled={disabled}
            onChange={(event) => setSideB(event.target.value)}
            placeholder="Side B"
            className="w-full rounded-md border border-takeups-border bg-takeups-bg px-3 py-2 text-sm text-takeups-text outline-none focus:border-takeups-blue"
          />
        </div>
        <Button
          type="button"
          variant="gold"
          disabled={!canAdd}
          onClick={addTopic}
          icon={<Plus size={16} />}
        >
          Add Custom Topic
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {topics.length ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="grid gap-3 rounded-md border border-takeups-border bg-takeups-bg p-3 text-sm text-takeups-text md:grid-cols-[1fr_auto]"
            >
              <div className="min-w-0">
                <div className="font-semibold">{topic.prompt}</div>
                <div className="mt-2 grid gap-2 text-xs text-takeups-muted md:grid-cols-2">
                  <span className="rounded border border-takeups-border px-2 py-1">{topic.sideA}</span>
                  <span className="rounded border border-takeups-border px-2 py-1">{topic.sideB}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                aria-label={`Remove ${topic.prompt}`}
                className="h-10 min-h-10 w-10 px-0"
                onClick={() => onChange(topics.filter((candidate) => candidate.id !== topic.id))}
                icon={<Trash2 size={16} />}
              />
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-takeups-border px-3 py-4 text-center text-sm text-takeups-muted">
            No custom topics loaded.
          </div>
        )}
      </div>
    </div>
  );
}

function createCustomTopicId(prompt: string): string {
  const slug =
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "custom-topic";
  return `${slug}-${Date.now().toString(36)}`;
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
