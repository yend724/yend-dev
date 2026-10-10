## collection は複数形、要素は単数形でそろえる

配列や集合は複数形、1 要素は単数形にする。collection と element の対応を名前で揃えると、ループや map/filter の可読性が大きく上がる。

**Bad:**

```ts
const user = await fetchUsers()

for (const item of user) {
  console.log(item.name)
}
```

**Good:**

```ts
const users = await fetchUsers()

for (const user of users) {
  console.log(user.name)
}
```

**追加例:**
- `tags` / `tag`
- `orders` / `order`
- `entriesById` / `entry`
