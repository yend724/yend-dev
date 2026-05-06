## テストファイルは対象コードと同じディレクトリに置く

テストファイルは必ず対象のソースファイルと同じディレクトリに colocate する。`__tests__/` やプロジェクトルートの `tests/` にまとめない。

**Bad (テストを別ディレクトリに集約):**

```
src/
  features/auth/
    hooks/use-auth.ts
    components/login-form.tsx
  __tests__/
    features/auth/
      use-auth.test.ts       <- 対象から遠い
      login-form.test.tsx
```

**Good (対象と同じディレクトリに配置):**

```
src/
  features/auth/
    hooks/
      use-auth.ts
      use-auth.test.ts       <- 対象の隣
    components/
      login-form.tsx
      login-form.test.tsx    <- 対象の隣
```

**E2E テストの配置:**

E2E テストはユーザージャーニー単位のため、プロジェクトルートの `e2e/` に置く。

```
e2e/
  auth.spec.ts
  checkout.spec.ts
project/
  src/
    ...
```

**メリット:**
- ファイルを開いた時にテストの有無が即座にわかる
- 対象コードを移動・削除する時にテストも一緒に扱える
- テストが無いファイルが可視化される
