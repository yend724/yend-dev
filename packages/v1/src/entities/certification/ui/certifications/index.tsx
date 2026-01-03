import { CERTIFICATIONS } from "../../../../shared/config/certification";

export const Certifications: React.FC = () => {
  return (
    <div className="markdown-body w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th>資格名</th>
            <th>取得年月</th>
          </tr>
        </thead>
        <tbody>
          {CERTIFICATIONS.map((certification) => {
            return (
              <tr key={certification.name}>
                <td className="w-full">{certification.name}</td>
                <td className="whitespace-nowrap">{certification.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
