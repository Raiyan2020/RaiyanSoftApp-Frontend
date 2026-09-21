'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { type AnyExtension } from '@tiptap/core';
import { EditorContent, JSONContent, useEditor, type Editor } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Code,
  Columns3,
  Heading1,
  Heading2,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Trash2,
  Underline,
  Undo2,
  Unlink,
  Youtube,
} from 'lucide-react';
import { createRichTextEditorExtensions } from './rich-text-editor-extensions';

type RichTextOutput = 'html' | 'json' | 'text';
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface RichTextEditorChangePayload {
  html: string;
  json: JSONContent;
  text: string;
}

interface RichTextEditorProps {
  value?: string | JSONContent;
  defaultValue?: string | JSONContent;
  onChange?: (value: string, payload: RichTextEditorChangePayload) => void;
  output?: RichTextOutput;
  label?: string;
  error?: string;
  placeholder?: string;
  characterLimit?: number | null;
  disabled?: boolean;
  minHeight?: number;
  className?: string;
  editorClassName?: string;
  showToolbar?: boolean;
  showBubbleMenu?: boolean;
  showFloatingMenu?: boolean;
  showCharacterCount?: boolean;
  extraExtensions?: AnyExtension[];
  dir?: 'ltr' | 'rtl' | 'auto';
}

const textColors = ['#092033', '#12a9d9', '#21d3a2', '#f5a524', '#ef4444', '#8b5cf6'];
const highlightColors = ['#fef08a', '#bfdbfe', '#bbf7d0', '#fed7aa', '#fecdd3', '#ddd6fe'];
const emptyExtensions: AnyExtension[] = [];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function getOutput(editor: Editor, output: RichTextOutput) {
  if (output === 'json') return JSON.stringify(editor.getJSON());
  if (output === 'text') return editor.getText();
  return editor.getHTML();
}

function isSameContent(editor: Editor, value?: string | JSONContent) {
  if (value === undefined) return true;
  if (typeof value === 'string') return editor.getHTML() === value;
  return JSON.stringify(editor.getJSON()) === JSON.stringify(value);
}

function ToolbarButton({
  label,
  isActive,
  disabled,
  onClick,
  children,
}: {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[var(--text-muted)] transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        isActive
          ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_14px_rgba(18,169,217,0.18)]'
          : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-7 w-px shrink-0 bg-[var(--border)]" aria-hidden="true" />;
}

function RichTextToolbar({ editor, compact = false }: { editor: Editor; compact?: boolean }) {
  const disabled = !editor.isEditable;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(translateMessage('Link URL'), previousUrl ?? 'https://');

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt(translateMessage('Image URL'));
    if (!url?.trim()) return;

    const alt = window.prompt(translateMessage('Alt text')) ?? '';
    editor.chain().focus().setImage({ src: url.trim(), alt }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt(translateMessage('YouTube URL'));
    if (!url?.trim()) return;
    editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className={cx('flex flex-wrap items-center gap-1', compact && 'max-w-[340px]')}>
      <ToolbarButton label={translateMessage('Paragraph')} isActive={editor.isActive('paragraph')} disabled={disabled} onClick={() => editor.chain().focus().setParagraph().run()}>
        <Pilcrow size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Heading 1')} isActive={editor.isActive('heading', { level: 1 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 1 as HeadingLevel }).run()}>
        <Heading1 size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Heading 2')} isActive={editor.isActive('heading', { level: 2 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 as HeadingLevel }).run()}>
        <Heading2 size={17} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={translateMessage('Bold')} isActive={editor.isActive('bold')} disabled={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Italic')} isActive={editor.isActive('italic')} disabled={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Underline')} isActive={editor.isActive('underline')} disabled={disabled} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Strike')} isActive={editor.isActive('strike')} disabled={disabled} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Inline code')} isActive={editor.isActive('code')} disabled={disabled} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Superscript')} isActive={editor.isActive('superscript')} disabled={disabled} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
        <Superscript size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Subscript')} isActive={editor.isActive('subscript')} disabled={disabled} onClick={() => editor.chain().focus().toggleSubscript().run()}>
        <Subscript size={17} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={translateMessage('Bullet list')} isActive={editor.isActive('bulletList')} disabled={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Ordered list')} isActive={editor.isActive('orderedList')} disabled={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Task list')} isActive={editor.isActive('taskList')} disabled={disabled} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <CheckSquare size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Blockquote')} isActive={editor.isActive('blockquote')} disabled={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Horizontal rule')} disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={17} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={translateMessage('Align left')} isActive={editor.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Align center')} isActive={editor.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Align right')} isActive={editor.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Justify')} isActive={editor.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <AlignJustify size={17} />
      </ToolbarButton>

      <Divider />

      <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[var(--text-muted)] transition-all hover:border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]" title={translateMessage('Text color')} aria-label={translateMessage('Text color')}>
        <Palette size={17} />
        <select
          className="sr-only"
          disabled={disabled}
          value={editor.getAttributes('textStyle').color ?? ''}
          onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
        >
          <option value="">{translateMessage('Default')}</option>
          {textColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>
      <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[var(--text-muted)] transition-all hover:border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]" title={translateMessage('Highlight')} aria-label={translateMessage('Highlight')}>
        <Highlighter size={17} />
        <select
          className="sr-only"
          disabled={disabled}
          value={editor.getAttributes('highlight').color ?? ''}
          onChange={(event) => editor.chain().focus().toggleHighlight({ color: event.target.value }).run()}
        >
          <option value="">{translateMessage('None')}</option>
          {highlightColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>

      <Divider />

      <ToolbarButton label={translateMessage('Link')} isActive={editor.isActive('link')} disabled={disabled} onClick={setLink}>
        <Link size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Remove link')} disabled={disabled || !editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Image')} disabled={disabled} onClick={addImage}>
        <ImageIcon size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('YouTube')} disabled={disabled} onClick={addYoutube}>
        <Youtube size={17} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={translateMessage('Insert table')} disabled={disabled} onClick={insertTable}>
        <Table size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Add row')} disabled={disabled || !editor.can().addRowAfter()} onClick={() => editor.chain().focus().addRowAfter().run()}>
        <Rows3 size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Add column')} disabled={disabled || !editor.can().addColumnAfter()} onClick={() => editor.chain().focus().addColumnAfter().run()}>
        <Columns3 size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Delete table')} disabled={disabled || !editor.can().deleteTable()} onClick={() => editor.chain().focus().deleteTable().run()}>
        <Trash2 size={17} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={translateMessage('Clear formatting')} disabled={disabled} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Undo')} disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={17} />
      </ToolbarButton>
      <ToolbarButton label={translateMessage('Redo')} disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={17} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  defaultValue = '',
  onChange,
  output = 'html',
  label,
  error,
  placeholder,
  characterLimit = null,
  disabled = false,
  minHeight = 220,
  className = '',
  editorClassName = '',
  showToolbar = true,
  showBubbleMenu = true,
  showFloatingMenu = true,
  showCharacterCount = true,
  extraExtensions = emptyExtensions,
  dir,
}: RichTextEditorProps) {
  const extensions = useMemo(
    () => [...createRichTextEditorExtensions({ placeholder, characterLimit }), ...extraExtensions],
    [characterLimit, extraExtensions, placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value ?? defaultValue,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cx('rich-text-editor-content', editorClassName),
        dir: dir ?? 'auto',
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange?.(getOutput(activeEditor, output), {
        html: activeEditor.getHTML(),
        json: activeEditor.getJSON(),
        text: activeEditor.getText(),
      });
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || isSameContent(editor, value)) return;
    editor.commands.setContent(value ?? '', { emitUpdate: false });
  }, [editor, value]);

  const characterCount = editor?.storage.characterCount;

  return (
    <div className={cx('w-full space-y-2', className)}>
      {label ? <label className="ms-1 block text-xs font-medium text-[var(--text-muted)]">{label}</label> : null}

      <div
        className={cx(
          'overflow-hidden rounded-xl border bg-[var(--surface)] transition-all',
          error ? 'border-red-500/50 focus-within:border-red-500' : 'border-[var(--border)] focus-within:border-primary/70',
          disabled && 'opacity-70',
        )}
      >
        {editor && showToolbar ? (
          <div className="border-b border-[var(--border)] bg-[var(--surface)] px-2 py-2">
            <RichTextToolbar editor={editor} />
          </div>
        ) : null}

        {editor && showBubbleMenu ? (
          <BubbleMenu editor={editor} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
            <RichTextToolbar editor={editor} compact />
          </BubbleMenu>
        ) : null}

        {editor && showFloatingMenu ? (
          <FloatingMenu editor={editor} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
            <RichTextToolbar editor={editor} compact />
          </FloatingMenu>
        ) : null}

        <EditorContent editor={editor} className="rich-text-editor-shell" />

        {editor && characterCount && showCharacterCount ? (
          <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-3 py-2 text-[11px] font-medium text-[var(--text-muted)]">
            {characterLimit ? (
              <span>
                {characterCount.characters()}/{characterLimit} {translateMessage('characters')}
              </span>
            ) : (
              <span>{characterCount.words()} {translateMessage('words')}</span>
            )}
          </div>
        ) : null}
      </div>

      {error ? <p className="ms-1 mt-0.5 text-[10px] font-medium text-red-400">{error}</p> : null}
    </div>
  );
}

export { RichTextToolbar };
