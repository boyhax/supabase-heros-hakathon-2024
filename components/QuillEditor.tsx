'use client'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuillEditor({
    onChange,
    value,
  }: {
    value?: string;
    onChange: (text: string) => void;
  }) {
    function handleChange(text: string) {
      onChange(text);
    }
    return (
      <div>
        <ReactQuill
        
          value={value || ""}
          modules={modules}
          formats={formats}
          onChange={handleChange}
        />
      </div>
    );
  }
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link",
      //  "image"
      ],
      ["clean"],
    ],
  };
  
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    // "image",
  ];
  