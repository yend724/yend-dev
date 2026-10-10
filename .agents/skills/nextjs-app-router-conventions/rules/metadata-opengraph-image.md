## OGP画像は opengraph-image.tsx で動的生成する

`opengraph-image.tsx` を使うと、ページごとにOGP画像を動的生成できる。静的画像を手動で作成・管理する手間がなくなり、コンテンツに合わせた最適な画像が自動的に提供される。

**Bad (静的OGP画像を手動管理):**

```tsx
// ❌ 記事ごとに画像を手動で作成・配置する必要がある
export const metadata = {
  openGraph: {
    images: ["/images/og-default.png"], // すべてのページで同じ画像
  },
}
```

**Good (opengraph-image.tsx で動的生成):**

```tsx
// app/posts/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "記事のOGP画像"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(r =>
    r.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 20 }}>
          Tech Blog
        </div>
        <div style={{ textAlign: "center", lineHeight: 1.3 }}>
          {post.title}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 30 }}>
          {post.author.name}
        </div>
      </div>
    ),
    { ...size }
  )
}
```

**原則:**
- `opengraph-image.tsx` はルートセグメントに配置 — そのセグメント以下のページに適用される
- `twitter-image.tsx` も同様に作成でき、Twitter Card用の画像を別途指定可能
- Edge Runtime を使うとレスポンスが速い
- フォントを使う場合は `fetch` でフォントファイルを読み込む
- `size` を export することで `<meta>` タグに width/height が自動設定される
