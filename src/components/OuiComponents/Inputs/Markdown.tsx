import {
  IconButton,
  Box as MuiBox,
  BoxProps as MuiBoxProps,
  TextField,
  TextFieldProps,
  styled,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import {
  FontBold,
  FontItalics,
  FontLink,
  FontOrderList,
  FontUnorderList,
} from "../Icons";
import { Box } from "../Layout";
import {
  ColorGrayDisabled,
  ColorPureBlack,
  ColorPureWhite,
  FontBase,
  TextSmallFont,
} from "../Theme";

const BASE_PROPS = {
  fontFamily: FontBase,
  minHeight: "300px",
};
const Container = styled((props: MuiBoxProps) => <MuiBox {...props} />)(
  ({}) => ({
    ...BASE_PROPS,
    backgroundColor: ColorPureWhite,

    minHeight: "140px",
    padding: "16px",

    borderRadius: "20px",
    border: "2px solid " + ColorGrayDisabled,

    "&:hover": {
      border: "2px solid " + ColorPureBlack,
    },
  })
);
const Controls = styled((props: MuiBoxProps) => <MuiBox {...props} />)(
  ({}) => ({
    minWidth: "200px",
    minHeight: "20px",
  })
);

const MarkdownEditor = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(({}) => ({
  minWidth: "50%",
  "& fieldset": {
    border: "none",
    // backgroundColor: ColorWhite,

    ...TextSmallFont,
  },
  "& textArea": {
    ...TextSmallFont,
  },
}));

interface IMDViewerProps {
  source: string;
}
export function MarkdownViewer(props: IMDViewerProps) {
  return (
    <MDEditor.Markdown
      style={{
        width: "50%",
        padding: "16px 14px",
        ...TextSmallFont,
      }}
      source={props.source}
    />
  );
}

export default function TextEditor(props: MuiBoxProps) {
  const [editorContent, setEditorContent] = useState<string>("");

  const handleEditorChange = (editorContent: string) => {
    setEditorContent(editorContent);
  };

  const handleBoldClick = () => {
    setEditorContent(editorContent + "****");
  };

  const handleItalicsClick = () => {
    setEditorContent(editorContent + "__");
  };

  const handleOListClick = () => {
    setEditorContent(editorContent + "\n1. ");
  };

  const handleUListClick = () => {
    setEditorContent(editorContent + "\n- ");
  };

  const handleLinkClick = () => {
    setEditorContent(editorContent + "[Titulo](URL)");
  };

  const handleAttachClick = () => {
    setEditorContent(editorContent + "...");
  };

  return (
    <Container {...props}>
      <Controls>
        <IconButton sx={{ marginRight: "16px" }} onClick={handleBoldClick}>
          <FontBold />
        </IconButton>
        <IconButton sx={{ marginRight: "16px" }} onClick={handleItalicsClick}>
          <FontItalics />
        </IconButton>
        <IconButton sx={{ marginRight: "16px" }} onClick={handleUListClick}>
          <FontUnorderList />
        </IconButton>
        <IconButton sx={{ marginRight: "16px" }} onClick={handleOListClick}>
          <FontOrderList />
        </IconButton>
        <IconButton sx={{ marginRight: "16px" }} onClick={handleLinkClick}>
          <FontLink />
        </IconButton>
        {/* Attach Function is not supported yet */}
        {/* <IconButton sx={{ marginRight: "16px" }} onClick={handleAttachClick}>
          <FontAttach />
        </IconButton> */}
      </Controls>
      <Box sx={{ display: "flex" }}>
        <MarkdownEditor
          multiline
          minRows={5}
          id="markdown_editor"
          onChange={(event: any) => handleEditorChange(event.target.value)}
          value={editorContent}
          autoFocus
        />
        <MarkdownViewer source={editorContent} />
      </Box>
    </Container>
  );
}
