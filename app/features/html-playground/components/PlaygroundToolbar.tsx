"use client";

import { DialogTrigger } from "react-aria-components";
import {
  LuCheck,
  LuClipboard,
  LuDownload,
  LuLayoutPanelLeft,
  LuMoon,
  LuPlay,
  LuRotateCcw,
  LuRows3,
  LuSun,
} from "react-icons/lu";

import { AlertDialog } from "@/shared/components/ui/AlertDialog";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Switch } from "@/shared/components/ui/Switch";
import { Toolbar } from "@/shared/components/ui/Toolbar";

import type { EditorTheme, PlaygroundOrientation } from "../types";

export function PlaygroundToolbar({
  autoRun,
  copied,
  editorTheme,
  orientation,
  onAutoRunChange,
  onCopy,
  onDownload,
  onEditorThemeChange,
  onOrientationChange,
  onReset,
  onRun,
}: {
  autoRun: boolean;
  copied: boolean;
  editorTheme: EditorTheme;
  orientation: PlaygroundOrientation;
  onAutoRunChange: (value: boolean) => void;
  onCopy: () => void;
  onDownload: () => void;
  onEditorThemeChange: (value: EditorTheme) => void;
  onOrientationChange: (value: PlaygroundOrientation) => void;
  onReset: () => void;
  onRun: () => void;
}) {
  return (
    <Toolbar
      aria-label="Playground actions"
      className="w-full gap-2 border-b border-border bg-card p-2 sm:p-3"
    >
      <Button onPress={onRun} className="h-11 flex-1 px-4 sm:h-10 sm:flex-none">
        <LuPlay className="fill-current" aria-hidden="true" />
        Run
        <kbd className="hidden rounded-sm border border-primary-foreground/30 px-1.5 py-0.5 text-[10px] xl:inline">
          Ctrl ↵
        </kbd>
      </Button>

      <Switch
        isSelected={autoRun}
        onChange={onAutoRunChange}
        className="h-11 rounded-sm border border-border px-3 sm:h-10"
      >
        Auto Run
      </Switch>

      <div className="hidden h-7 w-px bg-border sm:block" aria-hidden="true" />

      <Button aria-label="Copy active code" variant="quiet" onPress={onCopy} className="h-10 px-3">
        {copied ? <LuCheck aria-hidden="true" /> : <LuClipboard aria-hidden="true" />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <Button
        aria-label="Download standalone HTML"
        variant="quiet"
        onPress={onDownload}
        className="h-10 px-3"
      >
        <LuDownload aria-hidden="true" />
        <span className="hidden md:inline">Download HTML</span>
      </Button>
      <Button
        aria-label={
          orientation === "horizontal"
            ? "Stack editor and preview"
            : "Show editor and preview side by side"
        }
        variant="quiet"
        onPress={() =>
          onOrientationChange(orientation === "horizontal" ? "vertical" : "horizontal")
        }
        className="hidden h-10 px-3 min-[900px]:inline-flex"
      >
        {orientation === "horizontal" ? (
          <LuRows3 aria-hidden="true" />
        ) : (
          <LuLayoutPanelLeft aria-hidden="true" />
        )}
        <span className="hidden xl:inline">
          {orientation === "horizontal" ? "Stack panes" : "Side by side"}
        </span>
      </Button>
      <Button
        variant="quiet"
        onPress={() => onEditorThemeChange(editorTheme === "dark" ? "light" : "dark")}
        className="h-10 px-3"
      >
        {editorTheme === "dark" ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
        <span className="sr-only sm:not-sr-only sm:inline">
          {editorTheme === "dark" ? "Light editor" : "Dark editor"}
        </span>
      </Button>

      <DialogTrigger>
        <Button variant="quiet" className="h-10 px-3">
          <LuRotateCcw aria-hidden="true" />
          <span className="sr-only lg:not-sr-only lg:inline">Reset</span>
        </Button>
        <Modal>
          <AlertDialog
            title="Reset the playground?"
            variant="destructive"
            actionLabel="Reset code"
            onAction={onReset}
          >
            This replaces your saved HTML, CSS, and JavaScript with the starter example. This action
            cannot be undone.
          </AlertDialog>
        </Modal>
      </DialogTrigger>
    </Toolbar>
  );
}
