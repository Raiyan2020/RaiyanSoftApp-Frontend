import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { type AnyExtension } from '@tiptap/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { createLowlight } from 'lowlight';

const lowlight = createLowlight({
  bash,
  css,
  javascript,
  json,
  markdown,
  typescript,
  xml,
});

export interface RichTextEditorExtensionOptions {
  placeholder?: string;
  characterLimit?: number | null;
}

export function createRichTextEditorExtensions({
  placeholder = 'Start writing...',
  characterLimit = null,
}: RichTextEditorExtensionOptions = {}): AnyExtension[] {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Underline,
    TextStyle,
    Color,
    FontFamily,
    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'rich-text-link',
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      },
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'rich-text-image',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'rich-text-table',
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    Typography,
    Superscript,
    Subscript,
    Youtube.configure({
      controls: true,
      modestBranding: true,
      nocookie: true,
      width: 640,
      height: 360,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Placeholder.configure({
      placeholder,
    }),
    CharacterCount.configure({
      limit: characterLimit ?? undefined,
    }),
  ];
}
