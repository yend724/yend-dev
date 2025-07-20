type Props = {
  tags: string[];
};
export const Tags: React.FC<Props> = ({ tags }) => {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.sort().map((tag) => (
        <li key={tag} className="rounded-sm bg-sky-700 px-1 text-sm">
          {tag}
        </li>
      ))}
    </ul>
  );
};
