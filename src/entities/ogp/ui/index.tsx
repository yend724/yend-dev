import { SITE_METADATA } from "@/shared/config/site";

type Props = {
  title: string;
};
export const OgpImage: React.FC<Props> = ({ title }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 64,
        backgroundColor: "#262626",
        fontWeight: 400,
      }}
    >
      <div style={{ color: "#F5F5F5", fontSize: 64, fontWeight: 600 }}>
        {title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#F5F5F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={"https://avatars.githubusercontent.com/u/65233817"}
            alt=""
            width={80}
            height={80}
            style={{
              display: "flex",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          />
          <div
            style={{
              fontSize: 48,
              lineHeight: 1,
            }}
          >
            {SITE_METADATA.creator}
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            lineHeight: 1,
            opacity: 0.8,
          }}
        >
          {SITE_METADATA.domain}
        </div>
      </div>
    </div>
  );
};
