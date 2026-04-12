"use client";

import type { Editor } from "@tiptap/react";

import {
  LuBold,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuRedo,
  LuRemoveFormatting,
  LuUnderline,
  LuUndo,
} from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { ToggleButton } from "@/shared/components/ui/ToggleButton";
import { Toolbar } from "@/shared/components/ui/Toolbar";
import { cn } from "@/shared/utils/cn";

import { transformCurrentParagraphLineGroupToList } from "../utils/listTransform";

function getLinkUrl(editor: Editor) {
  const currentHref = editor.getAttributes("link").href;
  const nextHref = window.prompt("Enter a link URL", currentHref ?? "https://");

  if (nextHref === null) {
    return null;
  }

  return nextHref.trim();
}

function setLink(editor: Editor) {
  const href = getLinkUrl(editor);

  if (href === null) {
    return;
  }

  if (!href) {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
}

function ToolbarToggleButton({
  icon: Icon,
  isDisabled = false,
  isSelected,
  label,
  onPress,
}: {
  icon: typeof LuBold;
  isDisabled?: boolean;
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <ToggleButton
      aria-label={label}
      isDisabled={isDisabled}
      isSelected={isSelected}
      onPress={onPress}
      className={({ isSelected: selected }) =>
        cn(
          "h-9 min-w-9 border-border bg-background px-0 text-foreground hover:bg-accent hover:text-accent-foreground",
          selected && "border-primary/35 bg-primary/10 text-primary",
        )
      }
    >
      <Icon />
    </ToggleButton>
  );
}

function ToolbarActionButton({
  icon: Icon,
  isDisabled = false,
  label,
  onPress,
}: {
  icon: typeof LuBold;
  isDisabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      aria-label={label}
      isDisabled={isDisabled}
      onPress={onPress}
      variant="quiet"
      className="h-9 min-w-9 border border-border bg-background px-0 text-foreground hover:bg-accent hover:text-accent-foreground"
    >
      <Icon />
    </Button>
  );
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return (
      <Toolbar aria-label="Editor formatting" className="border-b border-border/70 px-3 py-2">
        <div className="text-sm text-muted-foreground">Loading editor tools…</div>
      </Toolbar>
    );
  }

  return (
    <Toolbar
      aria-label="Editor formatting"
      className="border-b border-border/70 bg-card/85 px-3 py-2 backdrop-blur"
    >
      <ToolbarActionButton
        label="Undo"
        icon={LuUndo}
        isDisabled={!editor.can().undo()}
        onPress={() => editor.chain().focus().undo().run()}
      />
      <ToolbarActionButton
        label="Redo"
        icon={LuRedo}
        isDisabled={!editor.can().redo()}
        onPress={() => editor.chain().focus().redo().run()}
      />

      <ToolbarToggleButton
        label="Bold"
        icon={LuBold}
        isDisabled={!editor.can().chain().focus().toggleBold().run()}
        isSelected={editor.isActive("bold")}
        onPress={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarToggleButton
        label="Italic"
        icon={LuItalic}
        isDisabled={!editor.can().chain().focus().toggleItalic().run()}
        isSelected={editor.isActive("italic")}
        onPress={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarToggleButton
        label="Underline"
        icon={LuUnderline}
        isDisabled={!editor.can().chain().focus().toggleUnderline().run()}
        isSelected={editor.isActive("underline")}
        onPress={() => editor.chain().focus().toggleUnderline().run()}
      />

      <ToolbarToggleButton
        label="Heading 1"
        icon={LuHeading1}
        isSelected={editor.isActive("heading", { level: 1 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarToggleButton
        label="Heading 2"
        icon={LuHeading2}
        isSelected={editor.isActive("heading", { level: 2 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarToggleButton
        label="Heading 3"
        icon={LuHeading3}
        isSelected={editor.isActive("heading", { level: 3 })}
        onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <ToolbarToggleButton
        label="Bullet list"
        icon={LuList}
        isSelected={editor.isActive("bulletList")}
        onPress={() => {
          if (transformCurrentParagraphLineGroupToList(editor, "bulletList")) {
            return;
          }

          editor.chain().focus().toggleBulletList().run();
        }}
      />
      <ToolbarToggleButton
        label="Ordered list"
        icon={LuListOrdered}
        isSelected={editor.isActive("orderedList")}
        onPress={() => {
          if (transformCurrentParagraphLineGroupToList(editor, "orderedList")) {
            return;
          }

          editor.chain().focus().toggleOrderedList().run();
        }}
      />
      <ToolbarToggleButton
        label={editor.isActive("link") ? "Edit link" : "Add link"}
        icon={LuLink}
        isSelected={editor.isActive("link")}
        onPress={() => setLink(editor)}
      />

      <ToolbarActionButton
        label="Clear formatting"
        icon={LuRemoveFormatting}
        onPress={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />
    </Toolbar>
  );
}
