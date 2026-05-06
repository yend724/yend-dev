## useEffect は外部システムとの同期専用にする

useEffect は「レンダー自体によって引き起こされる副作用」、つまり外部システムとの同期のためのものである。state の計算、イベント起因の処理、データの変換に useEffect を使うと、不要な再レンダリング・Effect 連鎖・処理フローの不透明化を招く。useEffect を書く前に「本当に必要か」を必ずチェックする。

### useEffect が正当なケース

外部システム（React の管理外）との同期にのみ使用する：

- **DOM API の直接操作** (video.play()、focus、スクロール位置など)
- **ブラウザ API との接続** (IntersectionObserver、ResizeObserver、matchMedia など)
- **WebSocket / EventSource の接続管理**
- **サードパーティライブラリの同期** (地図ライブラリ、jQuery ウィジェットなど)

```tsx
// ✅ 外部システム（DOM API）との同期
function VideoPlayer({ isPlaying }: { isPlaying: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isPlaying) {
      ref.current?.play()
    } else {
      ref.current?.pause()
    }
  }, [isPlaying])

  return <video ref={ref} />
}
```

```tsx
// ✅ 外部システム（WebSocket）との同期 + クリーンアップ
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    return () => connection.disconnect()
  }, [roomId])

  return <div>{/* ... */}</div>
}
```

### useEffect が不要なパターン

#### 1. レンダー中に計算できる値（導出値）

既存の props や state から計算できる値は state にしない。

```tsx
// ❌ useEffect で state を同期
const [fullName, setFullName] = useState("")
useEffect(() => {
  setFullName(firstName + " " + lastName)
}, [firstName, lastName])

// ✅ レンダー中に直接計算
const fullName = firstName + " " + lastName
```

重い計算は `useMemo` でキャッシュする：

```tsx
// ✅ useMemo で計算結果をキャッシュ
const visibleTodos = useMemo(
  () => getFilteredTodos(todos, filter),
  [todos, filter]
)
```

#### 2. ユーザー操作に起因する処理

「このコードが実行される理由は何か？」と自問する。ユーザー操作が起点なら、イベントハンドラに書く。

```tsx
// ❌ useEffect でユーザーアクションの結果を処理
useEffect(() => {
  if (product.isInCart) {
    showNotification("カートに追加しました")
  }
}, [product])

// ✅ イベントハンドラで直接処理
function handleBuyClick() {
  addToCart(product)
  showNotification("カートに追加しました")
}
```

#### 3. props 変更時の state リセット

`key` を使ってコンポーネントを再マウントする。

```tsx
// ❌ useEffect で state をリセット
useEffect(() => {
  setComment("")
}, [userId])

// ✅ key でコンポーネントごとリセット
<Profile userId={userId} key={userId} />
```

#### 4. 親への通知

子コンポーネントが親に変更を通知する場合、イベントハンドラから直接呼ぶ。

```tsx
// ❌ useEffect で親に通知
useEffect(() => {
  onChange(isOn)
}, [isOn, onChange])

// ✅ イベントハンドラで state 更新と通知をまとめる
function handleToggle() {
  const nextIsOn = !isOn
  setIsOn(nextIsOn)
  onChange(nextIsOn)
}
```

#### 5. useEffect の連鎖（Effect Chain）

ある useEffect が state を更新し、別の useEffect をトリガーするパターン。処理の流れが追いにくく、予期しない再レンダリングの原因になる。

```tsx
// ❌ Effect 連鎖
function CheckoutForm() {
  const [country, setCountry] = useState("")
  const [province, setProvince] = useState("")
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    setProvince("")
  }, [country])

  useEffect(() => {
    if (province) {
      calculateShipping(country, province).then(setShippingCost)
    }
  }, [country, province])

  const total = subtotal + shippingCost // ← これは導出値で OK

  return <div>{/* ... */}</div>
}

// ✅ イベントハンドラで一括処理
function CheckoutForm() {
  const [country, setCountry] = useState("")
  const [province, setProvince] = useState("")
  const [shippingCost, setShippingCost] = useState(0)

  const total = subtotal + shippingCost

  const handleCountryChange = async (newCountry: string) => {
    setCountry(newCountry)
    setProvince("")
    setShippingCost(0)
  }

  const handleProvinceChange = async (newProvince: string) => {
    setProvince(newProvince)
    const cost = await calculateShipping(country, newProvince)
    setShippingCost(cost)
  }

  return (
    <div>
      <CountrySelect value={country} onChange={handleCountryChange} />
      <ProvinceSelect value={province} onChange={handleProvinceChange} />
      <p>合計: {total}</p>
    </div>
  )
}
```

### 判断フローチャート

useEffect を書こうとしたら、以下の順に確認する：

1. **計算で求められる？** → state にせず導出値 or `useMemo` にする
2. **ユーザー操作が起点？** → イベントハンドラに書く
3. **props 変更で state リセット？** → `key` を使う
4. **親への通知？** → イベントハンドラから直接呼ぶ
5. **useEffect 内で `setState` している？** → 上記 1〜4 に該当しないか再検討
6. **外部システムとの同期？** → useEffect を使う（クリーンアップも忘れずに）
