## children を使って Server Component を Client Component 内に配置する

Client Component の `children` として渡された Server Component は、サーバーでレンダリングされた後にクライアントに挿入される。これにより、Client Component のレイアウト/インタラクション機能と Server Component のデータ取得を組み合わせられる。

**Bad (Server Component を Client Component 内で直接 import):**

```tsx
"use client"

import { ServerContent } from "./ServerContent"  // ❌ Client Bundle に含まれる

export function Modal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && (
        <div className="modal">
          <ServerContent />  {/* Client Component として扱われる */}
        </div>
      )}
    </>
  )
}
```

**Good (children パターン):**

```tsx
// Page.tsx (Server Component)
import { Modal } from "./Modal"
import { ServerContent } from "./ServerContent"

export default function Page() {
  return (
    <Modal>
      <ServerContent />  {/* ✅ サーバーでレンダリングされる */}
    </Modal>
  )
}

// components/Modal.tsx
"use client"

export function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div className="modal">{children}</div>}
    </>
  )
}

// components/ServerContent.tsx (Server Component)
export async function ServerContent() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

**このパターンが有効な場面:**
- モーダル、ドロワー、アコーディオンなどの開閉UI内にサーバーデータを表示
- タブ、カルーセルなどのインタラクティブレイアウトにサーバーコンテンツを配置
- アニメーションラッパーの中にサーバーコンテンツを入れる
