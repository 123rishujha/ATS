import React, { useMemo } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const ViewOnlyEditor = ({ documentData }) => {
  // Create editor instance
  const editor = useMemo(() => withReact(createEditor()), []);

  // Render function for different element types
  const renderElement = (props) => {
    const { attributes, children, element } = props;

    switch (element.type) {
      case "paragraph":
        return (
          <p {...attributes} className="mb-2">
            {children}
          </p>
        );
      default:
        return <div {...attributes}>{children}</div>;
    }
  };

  // Render function for leaf nodes (text formatting)
  const renderLeaf = (props) => {
    const { attributes, children, leaf } = props;

    let styledChildren = children;

    if (leaf.bold) {
      styledChildren = <strong>{styledChildren}</strong>;
    }

    if (leaf.italic) {
      styledChildren = <em>{styledChildren}</em>;
    }

    if (leaf.underline) {
      styledChildren = <u>{styledChildren}</u>;
    }

    return <span {...attributes}>{styledChildren}</span>;
  };

  return (
    <Slate editor={editor} initialValue={documentData}>
      <Editable
        readOnly={true}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        style={{
          outline: "none",
          border: "none",
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#374151",
        }}
      />
    </Slate>
  );
};

export default ViewOnlyEditor;
