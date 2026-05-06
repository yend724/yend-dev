## データ取得は Server Component で行い、結果を props で渡す

Server Component でデータを取得すれば、クライアントJSのロード→実行→fetch のウォーターフォールを排除できる。HTMLにデータが含まれた状態でストリーミングされる。

**Bad (Client Component で useEffect fetch):**

```tsx
"use client"

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <Skeleton />
  return <div>{user.name}</div>
}
```

**Good (Server Component で直接取得):**

```tsx
// Server Component
export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId)

  return <div>{user.name}</div>
}
```

**Client Component にデータが必要な場合:**

```tsx
// Server Component (親)
export default async function Page() {
  const user = await getUser()

  return <EditProfileForm user={user} />
}

// Client Component (子)
"use client"

export function EditProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  // user はサーバーで取得済み → クライアントfetch不要
  return <input value={name} onChange={e => setName(e.target.value)} />
}
```

**useEffect での fetch が許容されるケース:**
- ユーザーインタラクション後の追加データ取得（検索結果、無限スクロール等）
- リアルタイム更新（WebSocket, polling）
- 初期表示に不要なデータの遅延読み込み
