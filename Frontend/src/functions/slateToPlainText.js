import { Node } from "slate";

export const slateToPlainText = (nodes) => {
  return nodes
    .filter((el) => Node.string(el))
    .map((node) => Node.string(node))
    .join("\n\n");
};
