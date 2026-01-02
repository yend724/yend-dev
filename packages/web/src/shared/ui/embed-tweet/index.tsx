"use client";

import { useEffect, useRef } from "react";

export const EmbedTweet = ({ id }: { id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.setAttribute("charset", "utf-8");

    // ウィジェットのロード
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // クリーンアップ
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tweet-embed flex justify-center" ref={containerRef}>
      <blockquote
        className="twitter-tweet"
        data-conversation="none"
        data-theme="dark"
      >
        <a
          href={`https://twitter.com/x/status/${id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter投稿 {id}
        </a>
      </blockquote>
    </div>
  );
};
