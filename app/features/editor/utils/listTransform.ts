import type { Editor } from "@tiptap/react";

import { Fragment, type Mark, Node as ProseMirrorNode, type Schema } from "@tiptap/pm/model";

type ListType = "bulletList" | "orderedList";
type LineSegment = {
  text: string;
  marks: readonly Mark[];
};
type ParagraphLine = {
  segments: LineSegment[];
  text: string;
};
type ListLineMatch =
  | {
      type: "bullet";
      content: string;
    }
  | {
      type: "ordered";
      content: string;
      order: number;
    };

const BULLET_LINE_PATTERN = /^([*+-]|•)\s+(.+)$/;
const ORDERED_LINE_PATTERN = /^(\d+)[.)]\s+(.+)$/;

function getListLineMatch(text: string): ListLineMatch | null {
  const trimmed = text.trim();

  const orderedMatch = trimmed.match(ORDERED_LINE_PATTERN);
  if (orderedMatch) {
    return {
      type: "ordered",
      content: orderedMatch[2] ?? "",
      order: Number(orderedMatch[1]),
    };
  }

  const bulletMatch = trimmed.match(BULLET_LINE_PATTERN);
  if (bulletMatch) {
    return {
      type: "bullet",
      content: bulletMatch[2] ?? "",
    };
  }

  return null;
}

function getTextContent(node: ProseMirrorNode) {
  return node.isText ? (node.text ?? "") : "";
}

function splitParagraphIntoLines(paragraph: ProseMirrorNode) {
  const lines: ParagraphLine[] = [];
  let currentLine: ParagraphLine = { segments: [], text: "" };

  paragraph.forEach((child) => {
    if (child.type.name === "hardBreak") {
      lines.push(currentLine);
      currentLine = { segments: [], text: "" };
      return;
    }

    const text = getTextContent(child);
    currentLine.segments.push({ marks: child.marks, text });
    currentLine.text += text;
  });

  lines.push(currentLine);
  return lines;
}

function getActiveLineIndex(paragraph: ProseMirrorNode, parentOffset: number) {
  let offset = 0;
  let lineIndex = 0;

  paragraph.forEach((child) => {
    const nextOffset = offset + child.nodeSize;
    if (parentOffset >= offset && parentOffset <= nextOffset) {
      return false;
    }

    if (child.type.name === "hardBreak") {
      lineIndex += 1;
    }

    offset = nextOffset;
    return undefined;
  });

  return lineIndex;
}

function createTextFragment(schema: Schema, segments: LineSegment[], stripMarker: string) {
  let remainingToStrip = stripMarker.length;
  const nodes: ProseMirrorNode[] = [];

  for (const segment of segments) {
    let text = segment.text;

    if (remainingToStrip > 0) {
      const sliceLength = Math.min(remainingToStrip, text.length);
      text = text.slice(sliceLength);
      remainingToStrip -= sliceLength;
    }

    if (!text) {
      continue;
    }

    nodes.push(schema.text(text, segment.marks));
  }

  return Fragment.fromArray(nodes);
}

function createParagraphNode(schema: Schema, line: ParagraphLine) {
  return schema.nodes.paragraph.create(null, createTextFragment(schema, line.segments, ""));
}

function createListNode(
  schema: Schema,
  type: ListType,
  lines: ParagraphLine[],
  matches: ListLineMatch[],
) {
  const itemType = schema.nodes.listItem;
  const listTypeNode = schema.nodes[type];
  const paragraphType = schema.nodes.paragraph;

  const items = lines.map((line, index) => {
    const match = matches[index];
    const marker = line.text.slice(0, line.text.indexOf(match.content));
    const paragraph = paragraphType.create(null, createTextFragment(schema, line.segments, marker));

    return itemType.create(null, paragraph);
  });

  if (type === "orderedList") {
    const firstMatch = matches[0];
    const order = firstMatch?.type === "ordered" ? firstMatch.order : 1;
    return listTypeNode.create({ start: order > 1 ? order : null }, items);
  }

  return listTypeNode.create(null, items);
}

function isConvertibleMatch(match: ListLineMatch | null, type: ListType) {
  if (!match) {
    return false;
  }

  return type === "bulletList" ? match.type === "bullet" : match.type === "ordered";
}

export function transformCurrentParagraphLineGroupToList(editor: Editor, type: ListType) {
  const { selection } = editor.state;
  const { $from } = selection;
  const paragraph = $from.parent;

  if (paragraph.type.name !== "paragraph" || selection.empty === false) {
    return false;
  }

  const lines = splitParagraphIntoLines(paragraph);
  if (lines.length < 2) {
    return false;
  }

  const activeLineIndex = getActiveLineIndex(paragraph, $from.parentOffset);
  const lineMatches = lines.map((line) => getListLineMatch(line.text));
  const activeMatch = lineMatches[activeLineIndex];

  if (!isConvertibleMatch(activeMatch, type)) {
    return false;
  }

  let start = activeLineIndex;
  let end = activeLineIndex;

  while (start > 0 && isConvertibleMatch(lineMatches[start - 1], type)) {
    start -= 1;
  }

  while (end < lines.length - 1 && isConvertibleMatch(lineMatches[end + 1], type)) {
    end += 1;
  }

  const schema = editor.state.schema;
  const replacementNodes: ProseMirrorNode[] = [];
  const beforeLines = lines.slice(0, start).filter((line) => line.text.length > 0);
  const afterLines = lines.slice(end + 1).filter((line) => line.text.length > 0);
  const listLines = lines.slice(start, end + 1);
  const listMatches = lineMatches.slice(start, end + 1);

  replacementNodes.push(...beforeLines.map((line) => createParagraphNode(schema, line)));
  replacementNodes.push(createListNode(schema, type, listLines, listMatches as ListLineMatch[]));
  replacementNodes.push(...afterLines.map((line) => createParagraphNode(schema, line)));

  const paragraphStart = $from.start() - 1;
  const paragraphEnd = paragraphStart + paragraph.nodeSize;

  const transaction = editor.state.tr.replaceWith(
    paragraphStart,
    paragraphEnd,
    Fragment.fromArray(replacementNodes),
  );

  editor.view.dispatch(transaction.scrollIntoView());
  return true;
}
