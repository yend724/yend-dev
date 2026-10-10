## Props の型は type で定義し、React.FC で型付けする

Props の型定義には `interface` ではなく `type` を使う。型名は `コンポーネント名Props` とし、コンポーネントと同じファイル内に定義する。コンポーネントには `React.FC<Props>` で型を付ける。

**Bad:**

```tsx
// ❌ interface + 引数で直接型付け
interface Props {
  name: string
  email: string
}

export const UserProfile = ({ name, email }: Props) => {
  return <div>{/* ... */}</div>
}
```

**Good:**

```tsx
// ✅ type + コンポーネント名Props + React.FC
type UserProfileProps = {
  name: string
  email: string
  role?: "admin" | "member"
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, email, role = "member" }) => {
  return <div>{/* ... */}</div>
}
```
