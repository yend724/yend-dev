## モックはプロセス外依存にのみ使う

テストダブルはモック（振る舞いの検証）とスタブ（値の差し替え）に分けられる。いずれもプロセス外の依存にのみ使用し、プロセス内の協力オブジェクトには本物を使う。

さらにプロセス外依存は「管理下」と「管理外」に分かれ、テストダブルの使い方が異なる。

### モックとスタブの区別

| 種類 | 目的 | 検証対象 |
|------|------|---------|
| モック | 外部への出力を検証する | テスト対象が依存を正しく呼んだか（回数、引数） |
| スタブ | 外部からの入力を差し替える | テスト対象の戻り値や状態変化 |

**スタブに対して検証を行ってはならない。** スタブの呼び出し回数や引数を検証すると実装詳細に結合する。

### 管理下 vs 管理外の依存

| 依存の種類 | 例 | テストダブル | 理由 |
|-----------|-----|------------|------|
| 管理外のプロセス外依存 | 外部 API、メール送信、メッセージキュー | モックで検証 | 外部との契約を守っているか確認する必要がある |
| 管理下のプロセス外依存 | 自アプリ専用の DB | スタブで差し替え | 内部の実装詳細であり、最終的な状態で検証する |
| プロセス内の協力オブジェクト | 他の関数、ユーティリティ、ドメインロジック | 使わない（本物を使う） | モックするとリファクタリング耐性が失われる |

**Bad (プロセス内の協力オブジェクトをモック):**

```ts
import { vi } from "vitest"
import { processOrder } from "./order"
import * as pricing from "./pricing"
import * as inventory from "./inventory"

test("processOrder", () => {
  // NG: 内部で使う関数を全てモック
  // テストが実装詳細に結合し、リファクタリング耐性が失われる
  vi.spyOn(pricing, "calculatePrice").mockReturnValue(1000)
  vi.spyOn(inventory, "checkStock").mockReturnValue(true)

  const result = processOrder({ productId: "a", quantity: 1 })
  expect(result.totalPrice).toBe(1000)
})
```

**Bad (管理下の依存（スタブ）の呼び出しを検証):**

```ts
test("ユーザー情報を取得する", async () => {
  // repository は管理下の依存（自アプリ専用の DB）→ スタブとして使う
  const repository = {
    findById: vi.fn().mockResolvedValue({ id: "1", name: "Alice" }),
  }

  const result = await getUser(repository, "1")

  expect(result.name).toBe("Alice")
  // NG: 管理下の依存（スタブ）の呼び出し方を検証している（実装詳細への結合）
  expect(repository.findById).toHaveBeenCalledWith("1")
})
```

**Good (管理外依存にモック、管理下依存にスタブ):**

```ts
import { describe, expect, test, vi } from "vitest"
import { processOrder } from "./order"
import type { OrderRepository, EmailService } from "./types"

describe("processOrder", () => {
  test("注文完了後に確認メールを送信する", async () => {
    // Arrange
    // DB（管理下）: スタブとして値を返すだけ、呼び出しは検証しない
    const repository: OrderRepository = {
      save: vi.fn().mockResolvedValue({ id: "order-1" }),
      findProduct: vi.fn().mockResolvedValue({
        id: "a", price: 1000, stock: 10,
      }),
    }
    // メール送信（管理外）: モックとして呼び出しを検証する
    const emailService: EmailService = {
      send: vi.fn().mockResolvedValue(undefined),
    }

    // Act
    await processOrder(repository, emailService, {
      productId: "a",
      quantity: 2,
      email: "user@example.com",
    })

    // Assert: 管理外依存への出力を検証
    expect(emailService.send).toHaveBeenCalledWith(
      "user@example.com",
      expect.stringContaining("注文確認")
    )
  })
})
```

**原則:**
- モックが増えるほどリファクタリング耐性が下がる
- プロセス内をモックすると「内部実装のテスト」になり、リファクタリングのたびにテストが壊れる
- 依存を引数で受け取る設計にすると、プロセス外依存の差し替えが容易になる
- 管理下の依存（DB等）は最終的な状態で検証する方がリファクタリング耐性が高い
