## 主要なユーザージャーニーのみをカバーする

E2E テストはコストが高い（実行が遅く、壊れやすい）。ビジネスインパクトの大きい主要フローのみを対象とし、細かい UI の検証は単体テスト / コンポーネントテストに任せる。

**Bad (細かい UI を E2E でテスト):**

```ts
import { test, expect } from "@playwright/test"

// NG: ボタンの色やレイアウトを E2E で検証
test("ボタンが青色である", async ({ page }) => {
  await page.goto("/")
  const button = page.getByRole("button", { name: "送信" })
  await expect(button).toHaveCSS("background-color", "rgb(59, 130, 246)")
})
```

**Good (主要フローをカバー):**

```ts
import { test, expect } from "@playwright/test"

test.describe("認証フロー", () => {
  test("ログインしてダッシュボードにアクセスできる", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("メールアドレス").fill("user@example.com")
    await page.getByLabel("パスワード").fill("password123")
    await page.getByRole("button", { name: "ログイン" }).click()

    await expect(page).toHaveURL("/dashboard")
    await expect(page.getByText("ようこそ")).toBeVisible()
  })

  test("未認証ユーザーはログインページにリダイレクトされる", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/login")
  })
})

test.describe("商品購入フロー", () => {
  test("商品をカートに入れて購入できる", async ({ page }) => {
    await page.goto("/products")
    await page.getByRole("button", { name: "カートに追加" }).first().click()
    await page.getByRole("link", { name: "カート" }).click()

    await expect(page.getByText("1 件の商品")).toBeVisible()

    await page.getByRole("button", { name: "購入手続きへ" }).click()
    // ... 決済フロー
  })
})
```

**E2E でカバーすべきフロー:**
- 認証（ログイン / ログアウト / サインアップ）
- 主要なCRUD操作（作成 → 一覧表示 → 更新 → 削除）
- 決済・課金フロー
- 権限による表示切り替え

**E2E に含めないもの:**
- 個別コンポーネントの細かい挙動（コンポーネントテストで対応）
- バリデーションの全パターン（単体テストで対応）
- スタイル・レイアウトの検証（ビジュアルリグレッションテストで対応）

**原則:**
- `getByRole`, `getByLabel`, `getByText` を使い、テスト ID に頼らない
- テストデータのセットアップは API や DB シードで行う（UI 経由で作らない）
- 各テストは独立して実行可能にする（テスト間の依存を作らない）
