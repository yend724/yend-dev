"use client";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { ArrowUpRight, ArrowUp, ArrowDown, HelpCircle } from "lucide-react";
import { Dialog } from "@/shared/components/ui/dialog";
import { GitHubIcon } from "@/shared/components/icons/github-icon";
import { SocialIcon } from "@/shared/components/icons/social-icon";
import { areas, works, playgrounds, profile } from "@/features/ocean/data";
import { defaultTuning } from "@/features/ocean/scene/shaders";
import type { OceanEngine, SceneStats } from "@/features/ocean/scene/engine";
type Label = {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  near: boolean;
  label: string;
  kind: string;
};
const initialStats: SceneStats = {
  fps: 0,
  draws: 0,
  triangles: 0,
  dpr: 1,
  width: 0,
  height: 0,
  position: [0, 4.2, 9],
  heading: 0,
  area: "home",
  near: null,
  quality: "Auto",
};
const OceanExperience = () => {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<OceanEngine | null>(null),
    restoreFocus = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [modal, setModal] = useState<string | null>(null),
    [stats, setStats] = useState(initialStats),
    [labels, setLabels] = useState<Label[]>([]);
  const [speed, setSpeed] = useState(1);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const joy = useRef<number | null>(null);
  const labelNodes = useRef(new Map<string, HTMLDivElement>());
  const latestLabels = useRef<Label[]>([]);
  const updateLabels = useCallback((next: Label[]) => {
    const previous = latestLabels.current;
    latestLabels.current = next;
    // Coordinates are transient animation data; React owns content and visibility.
    for (const label of next) {
      const node = labelNodes.current.get(label.id);
      if (node && label.visible) {
        node.style.transform = `translate3d(${label.x}px, ${label.y}px, 0) translate(-50%, -100%)`;
      }
    }
    if (
      next.length !== previous.length ||
      next.some((label, index) => {
        const before = previous[index];
        return (
          !before ||
          label.id !== before.id ||
          label.visible !== before.visible ||
          label.near !== before.near ||
          label.label !== before.label ||
          label.kind !== before.kind
        );
      })
    ) {
      setLabels(next);
    }
  }, []);
  const open = useCallback((id: string) => {
    restoreFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    engine.current?.setPaused(true);
    setKnob({ x: 0, y: 0 });
    setModal(id);
  }, []);
  useEffect(() => {
    let canceled = false;
    import("@/features/ocean/scene/engine")
      .then(async ({ startOcean }) => {
        if (!host.current || canceled) return;
        const e = await startOcean(host.current, {
          onReady: () => {
            if (!canceled) setReady(true);
          },
          onError: setError,
          onSelect: open,
          onStats: setStats,
          onLabels: updateLabels,
        });
        if (canceled) e.dispose();
        else {
          engine.current = e;
          e.tune(defaultTuning);
        }
      })
      .catch((e) => {
        console.error(e);
        setError(
          "海を描画できませんでした。WebGL 2に対応したブラウザで再度お試しください。"
        );
      });
    return () => {
      canceled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [open, updateLabels]);
  useEffect(() => {
    engine.current?.setPaused(!!modal);
  }, [modal]);
  const project = [...works, ...playgrounds].find((p) => p.id === modal);
  const padMove = (e: PointerEvent<HTMLDivElement>) => {
    if (joy.current !== e.pointerId) return;
    const b = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - b.left - b.width / 2) / 38,
      y = (e.clientY - b.top - b.height / 2) / 38;
    const l = Math.hypot(x, y);
    if (l > 1) {
      x /= l;
      y /= l;
    }
    setKnob({ x: x * 28, y: y * 28 });
    engine.current?.setPad(x, y);
  };
  const padEnd = () => {
    joy.current = null;
    setKnob({ x: 0, y: 0 });
    engine.current?.setPad(0, 0);
  };
  return (
    <main
      className="ocean-app"
      data-ready={ready}
      data-position={stats.position.map((x) => x.toFixed(3)).join(",")}
      data-heading={stats.heading.toFixed(3)}
      data-near={stats.near || ""}
    >
      <div className="sea-canvas" ref={host} />
      <div className="vignette" />
      <header className="topbar">
        <h1 className="brand">YEND.DEV</h1>
        <nav className="nav" aria-label="エリアへ移動">
          {areas.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                engine.current?.travelToArea(a.id);
              }}
              title={`${a.label}へ移動`}
            >
              {a.id === "home" ? "Home" : a.label}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button
            className="round-button"
            disabled={!ready}
            aria-label={`遊泳速度 ${speed}倍。クリックで切り替え`}
            title="遊泳速度"
            onClick={() => {
              const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
              setSpeed(next);
              engine.current?.setSpeed(next);
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>{speed}×</span>
          </button>

          <button
            className="round-button"
            onClick={() => open("help")}
            aria-label="操作方法"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>
      {labels
        .filter((l) => l.visible)
        .map((l) => (
          <div
            key={l.id}
            className="world-label"
            ref={(node) => {
              if (node) {
                labelNodes.current.set(l.id, node);
                const position = latestLabels.current.find(
                  (label) => label.id === l.id
                );
                if (position) {
                  node.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -100%)`;
                }
              } else {
                labelNodes.current.delete(l.id);
              }
            }}
          >
            {l.near ? (
              <button
                onClick={() => open(l.id)}
                aria-label={`${l.label}を開く`}
              >
                {l.label}
                <ArrowUpRight size={13} />
              </button>
            ) : (
              <>
                <span className="label-line" />
                <span className="marker" />
              </>
            )}
          </div>
        ))}
      <>
        <div className="mobile-controls">
          <div
            className="joystick"
            role="group"
            aria-label="移動パッド"
            onPointerDown={(e) => {
              joy.current = e.pointerId;
              e.currentTarget.setPointerCapture(e.pointerId);
              padMove(e);
            }}
            onPointerMove={padMove}
            onPointerUp={padEnd}
            onPointerCancel={padEnd}
            onLostPointerCapture={padEnd}
          >
            <div
              className="joystick-knob"
              style={{ transform: `translate(${knob.x}px,${knob.y}px)` }}
            />
          </div>
          <div className="vertical-controls">
            {[1, -1].map((v) => (
              <button
                key={v}
                aria-label={v === 1 ? "上へ泳ぐ" : "下へ泳ぐ"}
                className="round-button"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  engine.current?.setVertical(v);
                }}
                onPointerUp={() => engine.current?.setVertical(0)}
                onPointerCancel={() => engine.current?.setVertical(0)}
                onLostPointerCapture={() => engine.current?.setVertical(0)}
              >
                {v === 1 ? <ArrowUp size={19} /> : <ArrowDown size={19} />}
              </button>
            ))}
          </div>
        </div>
      </>

      {!ready && !error && (
        <div className="loading">
          YEND.DEV<small>Loading…</small>
        </div>
      )}
      {error && (
        <div className="loading" role="alert">
          <span>YEND.DEV</span>
          <small>{error}</small>
          <button className="external-link" onClick={() => location.reload()}>
            再読み込み
          </button>
        </div>
      )}
      <Dialog
        open={!!modal}
        onDismiss={() => {
          setModal(null);
          engine.current?.setPaused(false);
        }}
        onAfterClose={() => restoreFocus.current?.focus()}
        aria-labelledby="modal-title"
        className="sea-dialog"
        aria-describedby={
          project
            ? "project-description"
            : modal === "profile"
              ? "profile-copy"
              : modal === "help"
                ? "help-description"
                : undefined
        }
      >
        {project && (
          <>
            <div>
              <h2 id="modal-title" className="card-title">
                {project.title}
              </h2>
            </div>
            {project.thumbnail && (
              <Image
                className="project-thumb"
                src={project.thumbnail}
                alt={`${project.title}のサムネイル`}
                width={640}
                height={400}
              />
            )}
            <p id="project-description" className="project-description">
              {project.description}
            </p>
            <a
              className="external-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              サイトを開く <ArrowUpRight size={17} />
            </a>
            {project.github && (
              <a
                className="external-link"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <GitHubIcon size={16} /> GitHub
                </span>
                <ArrowUpRight size={17} />
              </a>
            )}
          </>
        )}
        {modal === "profile" && (
          <>
            <div>
              <h2 id="modal-title" className="card-title">
                Profile
              </h2>
            </div>
            <p id="profile-copy" className="sr-only">
              取得した資格とSNSアカウントの一覧
            </p>
            <Image
              className="profile-icon"
              src={profile.icon}
              alt="YENDのアイコン。白いスナメリ"
              width={120}
              height={120}
            />
            <div>
              <div className="section-label">資格</div>
              <dl className="certifications">
                {profile.certifications.map((certification) => (
                  <div key={certification.name}>
                    <dt>{certification.name}</dt>
                    <dd>{certification.date}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <div className="section-label">SNS</div>
              <ul className="sns-links">
                {profile.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <SocialIcon id={social.id} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {modal === "help" && (
          <>
            <div>
              <h2 id="modal-title" className="card-title">
                泳ぎかた
              </h2>
            </div>
            <p id="help-description" className="profile-copy">
              タブで移動。手動操作で自由に泳げます。
            </p>
            <dl className="help-grid">
              <dt>泳ぐ</dt>
              <dd>
                WASD / 矢印キー
                <br />
                スマホは左下の移動パッド
              </dd>
              <dt>速度</dt>
              <dd>右上の倍率で1×・1.5×・2×に切り替え。</dd>
              <dt>上下</dt>
              <dd>
                Spaceで上昇、Shiftで下降
                <br />
                スマホは右下の上下ボタン
              </dd>
              <dt>見回す</dt>
              <dd>海をドラッグ。ホイールで距離調整。</dd>
              <dt>ひらく</dt>
              <dd>近づいて目印を選ぶ、またはEキー。</dd>
              <dt>戻る</dt>
              <dd>× またはEscape。元の場所から再開します。</dd>
            </dl>
          </>
        )}
      </Dialog>
    </main>
  );
};

export default OceanExperience;
