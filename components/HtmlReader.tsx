"use client";
// @ts-ignore
import HTMLRenderer from "react-html-renderer";

export default function HtmlReader({ value }: { value?: string }) {
  return <HTMLRenderer  html={value} />;
  
}
