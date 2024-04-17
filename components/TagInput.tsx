'use client'
import { WithContext as ReactTags } from "react-tag-input";
import suggestions from "@/utils/tagsSuggetions";

export default function TagInput({
  onChange,
  value,
}: {
  onChange: (value: string[]) => void;
  value: string[];
}) {
  return (
    <ReactTags
      tags={
        value
          ? value.map((v) => {
              return { id: v, text: v };
            })
          : undefined
      }
      suggestions={suggestions}
      //   delimiters={delimiters}
      handleDelete={(index) => onChange(value.filter((v, i) => i != index))}
      handleAddition={({ id }) => onChange([...value, id])}
      // handleDrag={handleDrag}
      // handleTagClick={handleTagClick}
      inputFieldPosition="bottom"
      autocomplete
      inline
      classNames={{
        tag: "border rounded-xl p-1  ",
        tags: "my-1",
        tagInput: "tagInputClass input input-bordered",
        tagInputField: "tagInputFieldClass",
        selected: "selectedClass",
        remove: "removeClass",
        suggestions: " bg-background text-foreground",
        activeSuggestion: "activeSuggestionClass",
        // editTagInput: "editTagInputClass",
        // editTagInputField: "editTagInputField",
        // clearAll: "clearAllClass",
      }}
    />
  );
}
