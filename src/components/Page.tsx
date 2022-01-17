import React from "react";
import "./Page.css";

interface PageProps {
  children?: React.ReactNode;
  className?: string;
}

function Page({ children, className }: PageProps) {
  return <div className={`Page ${className ? className : ""}`}>{children}</div>;
}

export default Page;
