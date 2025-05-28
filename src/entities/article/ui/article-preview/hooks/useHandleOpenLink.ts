import { openLink } from "@react-aria/utils";

import { useEffect, useRef } from "react";

export const useHandleOpenLink = () => {
  const clickableRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const clickableElement = clickableRef.current;
    const handleOpenLink = (event: PointerEvent) => {
      if (anchorRef.current) {
        openLink(anchorRef.current, event);
      }
    };
    clickableElement?.addEventListener("pointerup", handleOpenLink);
    return () => {
      clickableElement?.removeEventListener("pointerup", handleOpenLink);
    };
  }, []);

  return { anchorRef, clickableRef };
};
