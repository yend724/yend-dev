"use client";
import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type Props = {
  text: string;
};
export const CopyButton: React.FC<Props> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleCopy = useCallback(async (text: string) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      timerId.current = setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <button
      type="button"
      className="grid place-items-center rounded-md p-2 hover:bg-neutral-700"
      onClick={() => {
        handleCopy(text);
      }}
      ref={useCallback(() => {
        return () => clearTimeout(timerId.current);
      }, [])}
    >
      {isCopied ? <Check size={18} /> : <Copy size={18} />}
      <span className="sr-only">コビー</span>
    </button>
  );
};
