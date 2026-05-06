## 実装詳細ではなくユーザー行動をテストする

コンポーネントテストは、ユーザーが実際に行う操作（クリック、入力、表示確認）を軸に書く。内部の state や実装詳細（特定の CSS クラス、コンポーネント内部の関数呼び出し等）に依存しない。

**Bad (実装詳細に依存):**

```tsx
import { render } from "@testing-library/react"

test("Counter", () => {
  const { container } = render(<Counter />)
  // NG: CSS クラスや DOM 構造に依存
  const button = container.querySelector(".increment-btn")
  // NG: 内部 state を直接検証
  expect(container.querySelector(".count-value")?.textContent).toBe("0")
})
```

**Good (ユーザー行動ベース):**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"
import { Counter } from "./counter"

describe("Counter", () => {
  test("初期値が表示される", () => {
    render(<Counter initialCount={0} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  test("ボタンをクリックするとカウントが増える", async () => {
    const user = userEvent.setup()
    render(<Counter initialCount={0} />)

    await user.click(screen.getByRole("button", { name: "増やす" }))
    expect(screen.getByText("1")).toBeInTheDocument()
  })
})
```

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { SearchForm } from "./search-form"

describe("SearchForm", () => {
  test("入力して送信するとonSearchが呼ばれる", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchForm onSearch={onSearch} />)

    await user.type(screen.getByRole("textbox"), "test query")
    await user.click(screen.getByRole("button", { name: "検索" }))

    expect(onSearch).toHaveBeenCalledWith("test query")
  })

  test("空の入力では送信できない", async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchForm onSearch={onSearch} />)

    await user.click(screen.getByRole("button", { name: "検索" }))

    expect(onSearch).not.toHaveBeenCalled()
  })
})
```

**原則:**
- `getByRole`, `getByText`, `getByLabelText` を優先（ユーザーが認識する要素で取得する）
- `getByTestId` は他の方法で取得できない場合の最終手段
- `userEvent` を使う（`fireEvent` より実際のユーザー操作に近い）
- コンポーネントの外部インターフェース（props, コールバック, 表示）のみ検証する
