# YEND.DEV

Three.js r180と独自GLSLで構成した海中ポートフォリオ。画像を背景に使用せず、中央広場、Profileの入り江、Worksの光柱、Playgroundの抽象彫刻をひと続きの3D空間に配置。光柱と彫刻の数は `packages/resources` の作品数に従う。

Next.js (App Router) の静的エクスポート構成。`pnpm build` で `out/` に通常の静的ファイル（HTML / JS / CSS / アセット）を出力する。

UIはHTML標準要素と通常のCSSで構成する。ダイアログは `<dialog>`、カタログの切り替えには標準のボタンとチェックボックスを使用する。共通UIのスタイルは `src/shared/components/ui/ui.css`、全体のリセットと海中画面のスタイルは `src/shared/assets/css/example.css` に置く。

## 起動

pnpm workspace の1パッケージ（`@yend.dev/v2`）。Node.js 22.13以降とpnpmが必要で、依存関係のインストールはリポジトリルートで行う。

```sh
# リポジトリルートで
pnpm install
pnpm dev:v2
```

ターミナルに表示されたlocalhostのURLをブラウザで開く。

## 参考画面

開発サーバーの `/example` に、海中画面の実装をそのまま表示する参考ページを置いている。トップページを作り直す際の見本として使い、検索エンジンには登録しない。作り直しは `src/features/ocean2` で React Three Fiber を使って進め、`/` はそれを表示する。

## オブジェクト一覧

開発サーバーの `/objects` を開くと、スナメリ・光柱・彫刻・ランドマーク・岩・植物をサムネイル一覧で確認できる。検索とカテゴリで絞り込み、項目を選択すると右側に単独表示する。ドラッグで回転、ホイールやピンチでズームでき、正面・側面・上面への切り替え、アニメーション、ワイヤーフレームも使用できる。

本番の `createWorld` が生成する形状・材質を共有し、一覧は1つのWebGLコンテキストでサムネイルを生成する。光柱は全作品で同じ形状・材質のため1件にまとめて表示する。プレビューは形状を確認しやすい独立した照明・背景を使用する。旧Labモードは削除済み。

## スクリプト

リポジトリルートからは `:v2` 付き、`packages/v2` 内では `:v2` なしで実行する。

| ルート              | packages/v2 内   | 内容                                      |
| ------------------- | ---------------- | ----------------------------------------- |
| `pnpm dev:v2`       | `pnpm dev`       | 開発サーバー                              |
| `pnpm build:v2`     | `pnpm build`     | 静的ファイルを `out/` に出力              |
| `pnpm start:v2`     | `pnpm start`     | `out/` を静的サーバーで配信して確認       |
| `pnpm lint:v2`      | `pnpm lint`      | ESLint と Prettier のチェック             |
| —                   | `pnpm lint:fix`  | Prettier で整形してから ESLint の自動修正 |
| `pnpm typecheck:v2` | `pnpm typecheck` | TypeScriptの型検査                        |

## ディレクトリ構成

[bulletproof-react](https://github.com/alan2207/bulletproof-react) を参考にした機能単位の構成。共通部品は `shared/` に置く。

```
src/
├── app/                # Next.js のルート（ページ・レイアウト・グローバルCSS）。features を組み合わせるだけの層
├── features/           # 機能単位のモジュール。機能に閉じたコード以外は置かない
│   └── ocean/
│       ├── components/ # 海中体験のUI（ocean-experience.tsx）
│       ├── scene/      # Three.js の世界（engine / geometry / shaders / fog / loop / navigation）
│       └── data.ts     # resources の作品・プロフィールを海中用の形に変換。エリアも
└── shared/             # 複数の機能から使う共通部品
    ├── components/ui/  # HTML標準要素 + 通常のCSSのコンポーネント
    ├── config/         # @yend.dev/resources の再エクスポート（v1 と同じ @resources/* エイリアス）
    └── utils/          # 共通ユーティリティ（cn など）
```

依存の向きは `app → features → shared` の一方向のみ。次は行わない。

- `features/*` から `app/` を import する
- `shared/` から `features/` や `app/` を import する
- ある feature から別の feature を import する（機能同士の組み合わせは `app/` で行う）

ESLint による強制は今は外している（`import/no-restricted-paths` を使っていた）。必要になったら再度追加する。

## 作品・プロフィールのデータ

作品とプロフィール（アイコン・資格・SNS）は v1 と同じく workspace の `packages/resources`（`@yend.dev/resources`）から取得する。`tsconfig.json` の `@resources/*` エイリアスで `../resources/*` を参照し、`src/shared/config/project.ts` と `src/shared/config/profile.ts` で再エクスポートしている。

| 海中のエリア       | resources の配列              |
| ------------------ | ----------------------------- |
| Works（光柱）      | `WEB_APPS` → `LIBRARIES` の順 |
| Playground（彫刻） | `PLAYGROUNDS`                 |

id は配列の並び順から自動生成する。`thumbnail` が無い作品はカードに画像を出さない。作品を増減すると光柱・彫刻の数と配置も追従する。

## ページ

- `/` 海中の探索

## 操作

WASDまたは矢印キーでカメラ基準の水平移動、Spaceで上昇、Shiftで下降。ドラッグで360°視点操作、ホイールで距離調整。対象から8ワールド単位以内でクリックまたはEキーによりカードを開く。上部タブを選択すると、岩を避けてそのエリアへ自動遊泳し、カメラも追従。WASD・移動パッド・上下操作またはEscapeで中断できる。テレポートはしない。カード表示中は位置・向き・カメラを固定し、海のアニメーションを継続。Escapeまたは×で再開。

タッチ画面では移動パッド、上下ボタン、背景のドラッグ操作を使用。

## 編集箇所

| ファイル                                             | 内容                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| `../resources/projects/index.ts`                     | 作品データ（v1 と共有）                                      |
| `../resources/profile/index.ts`                      | アイコン・資格・SNS（v1 と共有）                             |
| `src/features/ocean/data.ts`                         | resources → 海中の Project / Profile への変換、エリア        |
| `src/features/ocean/scene/geometry.ts`               | 地形・岩・岩文字・各エリア・GLB読込・描画バッチ              |
| `src/features/ocean/scene/fog.ts`                    | 遠景・上方の霧。発光と粒子を含む全素材に適用                 |
| `src/features/ocean/scene/shaders.ts`                | 岩・肌・遊泳変形・法線・柱・画面効果・調整値                 |
| `src/features/ocean/scene/loop.ts`                   | 海の水平ループ                                               |
| `src/features/ocean/scene/navigation.ts`             | エリア到着位置、岩を避ける3D経路探索                         |
| `src/features/ocean/scene/engine.ts`                 | 追従カメラ、衝突判定、操作、接近判定、描画品質制御           |
| `src/features/ocean/components/ocean-experience.tsx` | HTML UI、作品カード、プロフィール                            |
| `src/shared/components/ui/`                          | HTML標準要素 + 通常のCSSのコンポーネント（dialog）           |
| `public/models/sunameri.glb`                         | スナメリのモデル                                             |
| `public/favicon.ico`                                 | v1から引き継いだfavicon                                      |
| `src/shared/config/site.ts`                          | サイトのメタ情報（title / description / OGP）。v1 からコピー |
| `public/assets/images/ogp.png`                       | OGP画像（v1 と同じ URL）                                     |

モデルは一体化した独自の陰関数サーフェスを三角形化したGLB。尾へ連続する曲げと胸ビレ付け根の変形に対してヤコビアンの余因子行列で法線を補正。影の深度パスにも同じ変形を使用。岩のシルエットは非均一の実ジオメトリ、表面はワールド座標の多段階ノイズと層状変化。文字はフォント輪郭からベベル付きで押し出し、頂点に微小な欠けを追加。

スナメリのヒレは元のGLBから縁の微小な浮遊片を除去し、ヒレ周辺だけ平滑化して法線を再計算した加工済みモデル。胴体・顔の頂点は固定し、ポリゴン数は増やしていない。
