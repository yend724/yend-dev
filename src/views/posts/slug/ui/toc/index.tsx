"use client";
import { useEffect } from "react";
import tocbot from "tocbot";

export const Toc = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".markdown-body",
      headingSelector: "h2",
      tocScrollingWrapper: null,
    });

    return () => {
      tocbot.destroy();
    };
  }, []);

  return (
    <details className="cursor-pointer rounded-sm bg-neutral-700">
      <summary className="p-3 font-semibold">目次</summary>
      <div className="px-3 pt-1 pb-2">
        <nav className="toc" />
      </div>
    </details>
  );
};
