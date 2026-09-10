"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CatalogItem, ObjectCatalog } from "../scene/object-catalog";
import "./object-catalog.css";

export const ObjectCatalogPage = () => {
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<ObjectCatalog | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [selected, setSelected] = useState("");
  const [category, setCategory] = useState("すべて");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  useEffect(() => {
    let canceled = false;
    const abort = new AbortController();
    let instance: ObjectCatalog | undefined;
    import("../scene/object-catalog")
      .then(async ({ startObjectCatalog }) => {
        if (!host.current || canceled) return;
        instance = await startObjectCatalog(host.current, abort.signal);
        if (canceled) {
          instance.dispose();
          return;
        }
        viewer.current = instance;
        setItems(instance.items);
        setSelected(instance.items[0]?.id ?? "");
      })
      .catch((reason) => {
        if (canceled) return;
        console.error(reason);
        if (!canceled)
          setError(
            "オブジェクトを読み込めませんでした。ページを再読み込みしてください。"
          );
      });
    return () => {
      canceled = true;
      abort.abort();
      instance?.dispose();
      viewer.current = null;
    };
  }, []);
  const active = items.find((item) => item.id === selected);
  const categories = ["すべて", ...new Set(items.map((item) => item.category))];
  const matches = items.filter(
    (item) =>
      (category === "すべて" || item.category === category) &&
      `${item.name} ${item.id}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
  );
  return (
    <main className="object-catalog">
      <header className="catalog-header">
        <div>
          <span className="catalog-eyebrow">YEND.DEV / ASSET LIBRARY</span>
          <h1>オブジェクト一覧</h1>
        </div>
        <Link href="/">海へ戻る ↗</Link>
      </header>
      <div className="catalog-layout">
        <section className="catalog-library" aria-label="オブジェクトを選択">
          <label className="catalog-search">
            検索
            <input
              type="search"
              placeholder="名前・IDで検索"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="catalog-filters" aria-label="カテゴリ">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="catalog-count" aria-live="polite">
            {items.length
              ? `${matches.length} / ${items.length} OBJECTS`
              : "オブジェクトを準備しています…"}
          </p>
          {error && <p role="alert">{error}</p>}
          <div className="catalog-grid">
            {matches.map((item) => (
              <button
                type="button"
                key={item.id}
                className="catalog-card"
                aria-pressed={selected === item.id}
                onClick={() => {
                  setSelected(item.id);
                  viewer.current?.select(item.id);
                }}
              >
                <Image
                  src={item.thumbnail}
                  alt=""
                  width={360}
                  height={240}
                  unoptimized
                />
                <span className="catalog-card-category">{item.category}</span>
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
          {items.length > 0 && !matches.length && (
            <p>条件に一致するオブジェクトがありません。</p>
          )}
        </section>
        <section
          className="catalog-inspector"
          aria-label="選択したオブジェクトの詳細"
        >
          <div className="catalog-preview-heading">
            <span>PREVIEW</span>
            <span>{active?.category ?? "読み込み中"}</span>
          </div>
          <div className="catalog-viewport" ref={host} />
          <div className="catalog-detail">
            <h2>{active?.name ?? "オブジェクトを読み込み中"}</h2>
            <p className="catalog-id">{active?.id ?? "—"}</p>
            <p className="catalog-hint">
              ドラッグで回転 · ホイール／ピンチで拡大縮小
            </p>
            <div className="catalog-view-controls" aria-label="視点">
              <button
                type="button"
                disabled={!active}
                onClick={() => viewer.current?.setView("front")}
              >
                正面
              </button>
              <button
                type="button"
                disabled={!active}
                onClick={() => viewer.current?.setView("side")}
              >
                側面
              </button>
              <button
                type="button"
                disabled={!active}
                onClick={() => viewer.current?.setView("top")}
              >
                上面
              </button>
              <button
                type="button"
                disabled={!active}
                onClick={() => viewer.current?.reset()}
              >
                リセット
              </button>
            </div>
            <div className="catalog-options">
              <label>
                <input
                  type="checkbox"
                  disabled={!active}
                  checked={animated}
                  onChange={(event) => {
                    setAnimated(event.target.checked);
                    viewer.current?.setAnimated(event.target.checked);
                  }}
                />
                アニメーション
              </label>
              <label>
                <input
                  type="checkbox"
                  disabled={!active}
                  checked={wireframe}
                  onChange={(event) => {
                    setWireframe(event.target.checked);
                    viewer.current?.setWireframe(event.target.checked);
                  }}
                />
                ワイヤーフレーム
              </label>
            </div>
            {active && (
              <dl className="catalog-metrics">
                <div>
                  <dt>メッシュ</dt>
                  <dd>{active.meshes}</dd>
                </div>
                <div>
                  <dt>三角形</dt>
                  <dd>{active.triangles.toLocaleString()}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
