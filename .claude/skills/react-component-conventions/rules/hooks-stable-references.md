## コールバックや依存値の参照安定性を意識する

オブジェクトや関数は毎レンダリングで新しい参照が生成される。これを子コンポーネントの props や useEffect の依存配列に渡すと、不要な再レンダリングや Effect の再実行が発生する。`useCallback` や `useMemo` で参照を安定化させる。

**Bad (毎回新しい参照が生成される):**

```tsx
function SearchPage() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<string[]>([])

  // ❌ 毎レンダリングで新しいオブジェクトと関数が生成
  const searchParams = { query, filters, timestamp: Date.now() }

  const handleSearch = (term: string) => {
    setQuery(term)
  }

  return (
    <div>
      {/* ❌ 毎回新しい参照が渡され、子が再レンダリング */}
      <SearchInput onSearch={handleSearch} />
      <SearchResults params={searchParams} />
    </div>
  )
}

function SearchResults({ params }: { params: SearchParams }) {
  useEffect(() => {
    // ❌ params の参照が毎回変わるので無限ループ
    fetchResults(params)
  }, [params])

  return <div>{/* ... */}</div>
}
```

**Good (参照を安定化):**

```tsx
function SearchPage() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<string[]>([])

  // ✅ query/filters が変わった時だけ新しい参照
  const searchParams = useMemo(
    () => ({ query, filters }),
    [query, filters]
  )

  // ✅ 安定した関数参照
  const handleSearch = useCallback((term: string) => {
    setQuery(term)
  }, [])

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <SearchResults params={searchParams} />
    </div>
  )
}

function SearchResults({ params }: { params: SearchParams }) {
  useEffect(() => {
    // ✅ params は query/filters が変わった時だけ変化
    fetchResults(params)
  }, [params])

  return <div>{/* ... */}</div>
}
```

**判断基準:**
- 子コンポーネントが `memo` で囲まれている → props の参照安定性が重要
- useEffect の依存配列にオブジェクトや関数を渡す → `useMemo`/`useCallback` を使う
- プリミティブ値（string, number, boolean）は参照安定性を気にしなくてよい
- React Compiler が有効な環境では自動メモ化されるため手動の `useMemo`/`useCallback` は不要。ただし React Compiler はまだ実験的な段階のプロジェクトも多いため、導入状況に応じて判断する
