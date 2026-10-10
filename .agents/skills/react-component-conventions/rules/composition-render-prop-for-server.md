## 複雑なレイアウトでは render prop で Server Component を注入する

Client Component が条件に応じて異なる Server Component を表示したい場合、render prop パターンを使うことで、Server Component をサーバー側でレンダリングしつつ Client Component に制御を委ねられる。children だけでは不十分な、データに依存したレイアウト切り替えに有効。

**Bad (Client Component 内で条件分岐して Server Component を import):**

```tsx
"use client"

import { DetailView } from "./DetailView"   // ❌ Server Component が Client に
import { CompactView } from "./CompactView"

export function ListItem({ item }: { item: Item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div onClick={() => setExpanded(!expanded)}>
      {expanded ? <DetailView item={item} /> : <CompactView item={item} />}
    </div>
  )
}
```

**Good (render prop で Server Component を注入):**

```tsx
// Page.tsx (Server Component)
import { ListItem } from "./ListItem"
import { DetailView } from "./DetailView"
import { CompactView } from "./CompactView"

export default async function Page() {
  const items = await fetchItems()

  return (
    <ul>
      {items.map(item => (
        <ListItem
          key={item.id}
          compact={<CompactView item={item} />}   {/* ✅ サーバーでレンダリング */}
          detail={<DetailView item={item} />}     {/* ✅ サーバーでレンダリング */}
        />
      ))}
    </ul>
  )
}

// components/ListItem.tsx
"use client"

interface ListItemProps {
  compact: React.ReactNode
  detail: React.ReactNode
}

export function ListItem({ compact, detail }: ListItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div onClick={() => setExpanded(!expanded)}>
      {expanded ? detail : compact}
    </div>
  )
}
```

**このパターンが有効な場面:**
- 表示切り替え（展開/折りたたみ、タブ切り替え）で異なるサーバーコンテンツを見せる
- リストアイテムごとに異なるレイアウトバリエーションを持つ
- children だけでは配置位置や切り替えロジックが表現できない場合
