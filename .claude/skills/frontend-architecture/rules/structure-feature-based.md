## コードは機能単位で features/ に整理する

コードは技術レイヤー（components, hooks, utils）ではなく、機能（feature）単位で整理する。各 feature はそのドメインに関するコンポーネント・hooks・アクション・型定義をまとめて持つ。

### ディレクトリ構成

```
src/
  app/                          ← ルーティング層
  features/                     ← 機能層：機能単位でコードを整理
    auth/
      components/
        login-form.tsx
        signup-form.tsx
      hooks/
        use-auth.ts
      actions/
        login.ts
        logout.ts
      types.ts
      index.ts                  ← public API（re-export）
    dashboard/
      components/
        stats-card.tsx
        recent-activity.tsx
      hooks/
        use-dashboard-data.ts
      types.ts
      index.ts
  shared/                       ← 共通層：feature に属さない共通コード
    components/
      ui/
        button.tsx
        dialog.tsx
    hooks/
      use-media-query.ts
    lib/
      format-date.ts
      api-client.ts
    types/
      api.ts
```

### feature の粒度

- feature はドメイン概念（認証、ダッシュボード、決済など）に対応させる
- ページ単位ではなく機能単位で切る（1つの feature が複数ページにまたがることもある）
- 迷ったら小さく始めて、必要に応じて分割する

### feature 内のディレクトリ構成

feature の規模に応じて柔軟にする。小さい feature は無理にサブディレクトリを切らない。

```
# 小さい feature — フラットでよい
features/
  settings/
    settings-form.tsx
    use-settings.ts
    types.ts
    index.ts

# 大きい feature — サブディレクトリで整理
features/
  auth/
    components/
    hooks/
    actions/
    types.ts
    index.ts
```
