## boolean は `is` / `has` / `can` などの述語で始める

boolean は真偽値であることが名前だけで分かるようにする。名詞単体や否定形より、述語として読める形を優先する。

**Bad:**

```ts
const active = user.status === "active"
const noPermission = role !== "admin"
const click = event.type === "click"
```

**Good:**

```ts
const isActive = user.status === "active"
const hasPermission = role === "admin"
const isClickEvent = event.type === "click"
```

**原則:**
- `is`, `has`, `can`, `should` を優先する
- `isNotX` より `!isX` のほうが読みやすい場合が多い
