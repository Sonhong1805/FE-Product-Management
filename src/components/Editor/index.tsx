/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import debounce from "@/helpers/debounce";
/* eslint-disable quotes */
import React, { useCallback, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";

import RcTiptapEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImageUpload,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
  VideoUpload,
  locale,
  TableOfContents,
  Excalidraw,
} from "reactjs-tiptap-editor";

import "reactjs-tiptap-editor/style.css";

const extensions = [
  BaseKit.configure({
    multiColumn: true,
    placeholder: {
      showOnlyCurrent: true,
    },
    characterCount: {
      limit: 50_000,
    },
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily.configure({
    fontFamilyList: [
      "Inter",
      "Comic Sans MS, Comic Sans",
      "serif",
      "cursive",
      "Arial",
      "Arial Black",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana",
      "Courier New",
      "Lucida Console",
      "Monaco",
      "monospace",
    ],
  }),
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Katex,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true,
    },
  }),
  Link,
  Image,
  ImageUpload.configure({
    upload: (file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);
        fetch("https://upload-image-wfpn.onrender.com/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Upload failed");
            }
            return response.json();
          })
          .then((data) => resolve(data.image))
          .catch((error) => reject(error));
      });
    },
  }),

  Video,
  VideoUpload.configure({
    upload: (files: File[]) => {
      const f = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));
      return Promise.resolve(f);
    },
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false,
  }),
  CodeBlock.configure({ defaultTheme: "dracula" }),
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));
      return Promise.resolve(f);
    },
  }),
  ExportWord,
  Excalidraw,
];

const DEFAULT = `<p></p>`;
function Editor({
  value,
  onGetValue,
  title,
}: {
  value: string;
  onGetValue: (html: string) => void;
  title: string;
}) {
  const [content, setContent] = useState(value || DEFAULT);
  const refEditor = React.useRef<any>(null);

  const [theme, setTheme] = useState("light");
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setContent(value || DEFAULT);
  }, [value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onValueChange = useCallback(
    debounce((value: any) => {
      setContent(value);
      onGetValue(value);
    }, 300),
    []
  );

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center">
        <h4>{title}</h4>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: 10,
          }}
          className="buttonWrap">
          <Button variant="secondary" onClick={() => locale.setLang("vi")}>
            Vietnamese
          </Button>
          <Button variant="secondary" onClick={() => locale.setLang("en")}>
            English
          </Button>
          <Button variant="secondary" onClick={() => locale.setLang("zh_CN")}>
            Chinese
          </Button>
          <Button variant="secondary" onClick={() => locale.setLang("pt_BR")}>
            Portugues
          </Button>
          <Button
            variant="secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button variant="secondary" onClick={() => setDisable(!disable)}>
            {disable ? "Editable" : "Readonly"}
          </Button>
        </div>
      </div>
      <RcTiptapEditor
        ref={refEditor}
        output="html"
        content={content}
        onChangeContent={onValueChange}
        extensions={extensions}
        dark={theme === "dark"}
        disabled={disable}
        minHeight={1000}
      />
      <div>
        ⚠Chú ý: Hiện tại thư viện &ldquo;reactjs-tiptap-editor&rdquo; chưa được
        hoàn thiện.Để có trải nghiệm tốt, bạn nên reload trang 1 vài lần.{" "}
      </div>
    </Container>
  );
}

export default Editor;
