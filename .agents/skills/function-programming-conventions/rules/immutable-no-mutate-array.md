## 配列の非破壊操作を徹底する

配列を操作する際は、元の配列を変更する破壊的メソッド（push, pop, splice, sort, reverse）を使わず、新しい配列を返す非破壊的メソッド（spread, toSorted, toSpliced, toReversed, filter, map）を使用する。

**Bad (破壊的メソッドの使用):**

```ts
function addTask(tasks: Task[], task: Task): Task[] {
  // ❌ push は元の配列を変更する
  tasks.push(task)
  return tasks // 元の配列と同じ参照を返している
}

function removeTask(tasks: Task[], index: number): Task[] {
  // ❌ splice は元の配列を変更する
  tasks.splice(index, 1)
  return tasks
}

function sortByDate(tasks: Task[]): Task[] {
  // ❌ sort は元の配列を破壊する
  return tasks.sort((a, b) => a.createdAt - b.createdAt)
}

function moveToTop(tasks: Task[], index: number): Task[] {
  // ❌ splice + unshift で元配列を2回破壊
  const [item] = tasks.splice(index, 1)
  tasks.unshift(item)
  return tasks
}
```

**Good (非破壊的メソッドの使用):**

```ts
function addTask(tasks: ReadonlyArray<Task>, task: Task): Task[] {
  // ✅ spread で新しい配列を生成
  return [...tasks, task]
}

function removeTask(tasks: ReadonlyArray<Task>, index: number): Task[] {
  // ✅ toSpliced で非破壊的に要素を削除
  return tasks.toSpliced(index, 1)
}

function sortByDate(tasks: ReadonlyArray<Task>): Task[] {
  // ✅ toSorted で新しいソート済み配列を返す
  return tasks.toSorted((a, b) => a.createdAt - b.createdAt)
}

function moveToTop(tasks: ReadonlyArray<Task>, index: number): Task[] {
  // ✅ 非破壊的に要素を移動
  const item = tasks[index]
  return [item, ...tasks.toSpliced(index, 1)]
}

function reverseOrder(tasks: ReadonlyArray<Task>): Task[] {
  // ✅ toReversed で非破壊的に反転
  return tasks.toReversed()
}

function updateTask(tasks: ReadonlyArray<Task>, index: number, updates: Partial<Task>): Task[] {
  // ✅ with() で特定インデックスの要素を非破壊的に置換
  return tasks.with(index, { ...tasks[index], ...updates })
}
```

**判断基準:**
- `push` → `[...arr, item]`
- `unshift` → `[item, ...arr]`
- `pop` → `arr.slice(0, -1)`
- `splice` → `arr.toSpliced(index, count, ...items)`
- `sort` → `arr.toSorted(compareFn)`
- `reverse` → `arr.toReversed()`
- `arr[i] = value` → `arr.with(i, value)`
- 引数に `ReadonlyArray<T>` を使うことで、型レベルで破壊的メソッドの呼び出しを防止する
