## オブジェクトを直接変更しない

オブジェクトを更新する際は、元のオブジェクトを直接変更せず、spread構文で新しいオブジェクトを生成する。型レベルで `Readonly` を付けることで、直接変更をコンパイル時に防止する。

**Bad (オブジェクトの直接変更):**

```ts
function updateTheme(settings: Settings, theme: Theme): Settings {
  // ❌ 元のオブジェクトを直接変更
  settings.theme = theme
  return settings
}

function updateNestedConfig(settings: Settings, key: string, value: string): Settings {
  // ❌ ネストしたオブジェクトを直接変更
  settings.notifications.preferences[key] = value
  return settings
}
```

**Good (型レベルで不変性を保証 + 非破壊的な更新):**

```ts
function updateTheme(settings: Readonly<Settings>, theme: Theme): Settings {
  // ✅ Readonly で直接変更をコンパイルエラーにする
  // ✅ spread で新しいオブジェクトを生成
  return { ...settings, theme }
}

function updateNestedConfig(
  settings: Readonly<Settings>,
  key: string,
  value: string
): Settings {
  // ✅ ネストした更新もspreadで各レベルを新規生成
  return {
    ...settings,
    notifications: {
      ...settings.notifications,
      preferences: {
        ...settings.notifications.preferences,
        [key]: value,
      },
    },
  }
}
```

**判断基準:**
- 引数の型に `Readonly` を付けて、直接変更をコンパイル時に検出する
- `obj.prop = value` → `{ ...obj, prop: value }`
- ネストが深い場合は、更新用ヘルパー関数の導入を検討する
- `delete obj.prop` → `const { prop, ...rest } = obj; return rest`
