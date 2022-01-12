import React from "react";
import "./Page.css";

interface PageProps {
children?: React.ReactNode;
}

function Page ({ children }:PageProps) {
return <div className="Page">{children}</div>;
}

export default Page;
