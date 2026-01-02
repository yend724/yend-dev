type Props = {
  tags: string[];
};
export const Tags: React.FC<Props> = ({ tags }) => {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.sort().map((tag) => (
        <li key={tag} className="bg-blue-9 rounded-sm px-1 text-sm">
          {tag}
        </li>
      ))}
    </ul>
  );
};
