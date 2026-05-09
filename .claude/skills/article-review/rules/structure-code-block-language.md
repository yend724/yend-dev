## コードブロックには言語識別子を必ず付ける

フェンス付きコードブロックには言語識別子を必ず付ける。シンタックスハイライトと、後段の整形・lint ツールが正しく動作するために必要。

**Bad(言語指定なし):**

````md
```
const greet = (name: string) => `Hello, ${name}`
```
````

**Good:**

````md
```ts
const greet = (name: string) => `Hello, ${name}`
```
````

**よく使う識別子:**

- `ts` / `tsx` — TypeScript / TSX
- `js` / `jsx` — JavaScript / JSX
- `bash` / `sh` — シェル
- `yaml` — YAML
- `json` — JSON
- `md` — Markdown
- `text` — 言語非依存の出力例(CLI ログなど)

**チェック観点:**

- ` ``` ` 直後に言語識別子があるか(空のまま開いていないか)
- 識別子が記事内で揃っているか(`typescript` と `ts` の混在等)
- 言語が定まらない出力例も `text` を明示し、空のままにしない
