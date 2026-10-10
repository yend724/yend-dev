## アロー関数 + named export でコンポーネントを定義する

コンポーネントはアロー関数で定義し、named export を使う。default export は使わない。

**Bad:**

```tsx
// ❌ function 宣言 + default export
export default function UserProfile({ name, email }: Props) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  )
}
```

**Good:**

```tsx
// ✅ アロー関数 + named export
export const UserProfile = ({ name, email }: Props) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  )
}
```
