"use client";
import { useEffect } from "react";
import * as tocbot from "tocbot";

export const Toc = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".markdown-body",
      headingSelector: "h2",
    });

    return () => {
      tocbot.destroy();
    };
  }, []);

  return (
    <details className="cursor-pointer rounded bg-neutral-700 p-3">
      <summary className="font-semibold">目次</summary>
      <div className="py-1 pl-1">
        <nav className="toc" />
      </div>
    </details>
  );
};
