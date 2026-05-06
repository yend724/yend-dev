export type Heading = {
  text: string;
  id: string;
  level: number;
};

export const extractHeadings = (content: string): Heading[] => {
  const lines = content.split("\n");
  let inCodeBlock = false;
  const headings: Heading[] = [];

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const text = match[2];
      headings.push({ text, id: text, level: match[1].length });
    }
  }

  return headings;
};
