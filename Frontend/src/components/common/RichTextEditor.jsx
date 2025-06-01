import React, { useMemo, useCallback, useEffect } from "react";
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
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

  // Custom paste handler
  const handlePaste = useCallback(
    (event) => {
      const text =
        event.clipboardData.getData("text/html") ||
        event.clipboardData.getData("text/plain");

      // Prevent default paste
      event.preventDefault();

      // Parse the pasted content
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // Convert HTML to Slate nodes
      const fragment = [];
      doc.body.childNodes.forEach((node) => {
        if (node.nodeName === "P") {
          fragment.push({
            type: "paragraph",
            children: [{ text: node.textContent }],
          });
        } else if (node.nodeName === "H1" || node.nodeName === "H2") {
          fragment.push({
            type: "heading-two",
            children: [{ text: node.textContent }],
          });
        } else if (node.nodeName === "UL") {
          const listItems = Array.from(node.childNodes).map((li) => ({
            type: "list-item",
            children: [{ text: li.textContent }],
          }));
          fragment.push({
            type: "bulleted-list",
            children: listItems,
          });
        } else if (node.nodeName === "OL") {
          const listItems = Array.from(node.childNodes).map((li) => ({
            type: "list-item",
            children: [{ text: li.textContent }],
          }));
          fragment.push({
            type: "numbered-list",
            children: listItems,
          });
        } else {
          fragment.push({
            type: "paragraph",
            children: [{ text: node.textContent }],
          });
        }
      });

      // Insert the fragment at the current selection
      Transforms.insertFragment(editor, fragment);
    },
    [editor]
  );

  // Custom key handler for backspace
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Backspace") {
        const { selection } = editor;

        if (selection && selection.focus.offset === 0) {
          const [node] = Editor.node(editor, selection.focus.path);

          // Handle backspace at the start of a list item
          if (node.type === "list-item") {
            event.preventDefault();
            Editor.unwrapNodes(editor, {
              match: (n) =>
                n.type === "bulleted-list" || n.type === "numbered-list",
              split: true,
            });
            Editor.setNodes(editor, { type: "paragraph" });
            return;
          }

          // Handle backspace at the start of a heading
          if (node.type === "heading-two") {
            event.preventDefault();
            Editor.setNodes(editor, { type: "paragraph" });
            return;
          }
        }
      }
    },
    [editor]
  );

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
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
