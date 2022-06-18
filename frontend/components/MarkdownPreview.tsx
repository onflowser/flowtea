import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import { MarkdownPreviewProps } from "@uiw/react-markdown-preview";
import styled from "styled-components";

type Props = MarkdownPreviewProps;

export function MarkdownPreview({ ...props }: Props) {
  // @ts-ignore
  return <Viewer {...props} />;
}

const Viewer = styled(MDEditor.Markdown)`
  background-color: transparent;
  * {
    font-family: "Poppins", sans-serif;
  }
`;
