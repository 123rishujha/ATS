import React, { useMemo, useCallback, useEffect } from "react";
import { createEditor, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const RichTextEditor = ({
  value = initialValue,
  onChange,
  placeholder = "Write something...",
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Log the incoming value prop whenever it changes
  useEffect(() => {
    console.log("RichTextEditor - Incoming Value:", value);
  }, [value]);

  // Log the internal editor value whenever it changes
  useEffect(() => {
    console.log("RichTextEditor - Internal Editor Value:", editor.children);
  }, [editor.children]);

  const renderElement = useCallback((props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case "heading-two":
        return (
          <h2 className="text-2xl font-bold mb-4" {...attributes}>
            {children}
          </h2>
        );
      case "bulleted-list":
        return (
          <ul className="list-disc ml-6 mb-4" {...attributes}>
            {children}
          </ul>
        );
      case "numbered-list":
        return (
          <ol className="list-decimal ml-6 mb-4" {...attributes}>
            {children}
          </ol>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      default:
        return (
          <p className="mb-4" {...attributes}>
            {children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    const { attributes, children, leaf } = props;
    let content = children;
    if (leaf.bold) {
      content = <strong>{content}</strong>;
    }
    if (leaf.italic) {
      content = <em>{content}</em>;
    } else if (leaf.text === "") {
      content = <br />;
    }
    return <span {...attributes}>{content}</span>;
  }, []);

  const toggleFormat = (format) => {
    const isActive = isFormatActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toggleBlock = (format) => {
    const isActive = isBlockActive(format);
    const isList = format === "bulleted-list" || format === "numbered-list";

    Editor.unwrapNodes(editor, {
      match: (n) => ["bulleted-list", "numbered-list"].includes(n.type),
      split: true,
    });

    Editor.setNodes(
      editor,
      {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
      },
      { match: (n) => Editor.isBlock(editor, n) }
    );

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Editor.wrapNodes(editor, block);
    }
  };

  const isFormatActive = (format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const isBlockActive = (format) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => n.type === format,
      })
    );

    return !!match;
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat("bold")}
          className={isFormatActive("bold") ? "bg-accent" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat("italic")}
          className={isFormatActive("italic") ? "bg-accent" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBlock("heading-two")}
          className={isBlockActive("heading-two") ? "bg-accent" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBlock("bulleted-list")}
          className={isBlockActive("bulleted-list") ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBlock("numbered-list")}
          className={isBlockActive("numbered-list") ? "bg-accent" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <Slate
        editor={editor}
        initialValue={value}
        value={value || initialValue}
        onChange={onChange}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          className="p-4 min-h-[200px] prose prose-sm max-w-none focus:outline-none"
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
