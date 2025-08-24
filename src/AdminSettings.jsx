// src/AdminSettings.jsx
import React, { useEffect, useRef, useState } from "react";

/** ---- CẤU HÌNH MẶC ĐỊNH ---- */
const DEFAULT_SETTINGS = {
  site: { name: "Reward Web", primary: "#d71920", secondary: "#0ea5e9" },
  banner: {
    enabled: true,
    title: "Xem quảng cáo nhận thưởng",
    subtitle: "Xem đủ thời lượng để nhận point",
    image: "",
    ctaText: "Bắt đầu",
    ctaLink: "/",
  },
  ads: {
    autoplay: true,
    countdown: 10,
    requiredWatchSec: 8,
    list: [],
  },
  bonus: {
    enabled: false,
    showAfter: 3,
    rewards: [{ points: 10, note: "Thưởng xem liên tiếp" }],
  },
  sfx: { enabled: true, volume: 0.5 },
  backend: { enabled: true },
};

/** ---- TIỆN ÍCH ---- */
const deepMerge = (base, patch) => {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base === "object" && base) {
    const out = { ...base };
    for (const k of Object.keys(patch || {})) {
      out[k] =
        typeof base[k] === "object" && base[k] && typeof patch[k] === "object"
          ? deepMerge(base[k], patch[k])
          : patch[k];
    }
    return out;
  }
  return patch ?? base;
};

const download = (obj, filename = "settings.json") => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
};

/** =======================================================================
 *  Trang bọc: tự fetch & lưu qua HTTP (KHÔNG import code trong /api)
 *  =======================================================================
 */
export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [note, setNote] = useState("");

  // Load settings từ server
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/settings -> ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setSettings(deepMerge(DEFAULT_SETTINGS, data || {}));
        }
      } catch (err) {
        // Nếu backend chưa có bản ghi, dùng default
        console.warn(err);
        if (mounted) setSettings(DEFAULT_SETTINGS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Lưu lên server
  const handleSave = async (next) => {
    setNote("Đang lưu...");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`POST /api/settings -> ${res.status}`);
      setSettings(next);
      setNote("Đã lưu cấu hình ✓");
    } catch (e) {
      console.error(e);
      setNote("Lỗi khi lưu cấu hình. Xem console.");
      alert("Lưu thất bại. Kiểm tra server log /api/settings.");
    } finally {
      setTimeout(() => setNote(""), 2000);
    }
  };

  const handleExport = () => {
    const d = new Date();
    const stamp =
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0");
    download(settings, `settings-${stamp}.json`);
  };

  const handleImport = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const merged = deepMerge(DEFAULT_SETTINGS, json);
      await handleSave(merged);
    } catch (e) {
      console.error(e);
      alert("File JSON không hợp lệ.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 16, color: "#e2e8f0" }}>Đang tải cấu hình…</div>
    );
  }

  return (
    <div style={{ color: "#e2e8f0" }}>
      <AdminSettings
        settings={settings}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
      />
      {note && (
        <div style={{ marginTop: 8, opacity: 0.85, fontSize: 14 }}>{note}</div>
      )}
    </div>
  );
}

/** =======================================================================
 *  Component form: GIỮ NGUYÊN Ý tưởng bạn gửi, chỉ gia cố an toàn dữ liệu
 *  =======================================================================
 */
export function AdminSettings({ settings, onSave, onImport, onExport }) {
  const [form, setForm] = useState(() => deepMerge(DEFAULT_SETTINGS, settings));
  const fileRef = useRef(null);

  // Khi props settings đổi (sau fetch), sync vào form
  useEffect(() => {
    setForm((prev) => deepMerge(prev, settings || {}));
  }, [settings]);

  // Helper set theo path "a.b.c"
  const set = (path, val) => {
    const parts = path.split(".");
    const next = { ...form };
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      cur[k] = { ...(cur[k] || {}) };
      cur = cur[k];
    }
    cur[parts.at(-1)] = val;
    setForm(next);
  };

  const row = (label, children) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 12,
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <div style={{ opacity: 0.8 }}>{label}</div>
      <div>{children}</div>
    </div>
  );

  return (
    <div
      style={{
        padding: 16,
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 12,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Cấu hình hệ thống</h3>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Site</h4>
        {row(
          "Tên site",
          <input
            value={form.site?.name ?? ""}
            onChange={(e) => set("site.name", e.target.value)}
          />
        )}
        {row(
          "Màu chính",
          <input
            value={form.site?.primary ?? ""}
            onChange={(e) => set("site.primary", e.target.value)}
          />
        )}
        {row(
          "Màu phụ",
          <input
            value={form.site?.secondary ?? ""}
            onChange={(e) => set("site.secondary", e.target.value)}
          />
        )}
      </section>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Banner</h4>
        {row(
          "Bật banner",
          <input
            type="checkbox"
            checked={!!form.banner?.enabled}
            onChange={(e) => set("banner.enabled", e.target.checked)}
          />
        )}
        {row(
          "Tiêu đề",
          <input
            value={form.banner?.title ?? ""}
            onChange={(e) => set("banner.title", e.target.value)}
          />
        )}
        {row(
          "Phụ đề",
          <input
            value={form.banner?.subtitle ?? ""}
            onChange={(e) => set("banner.subtitle", e.target.value)}
          />
        )}
        {row(
          "Ảnh URL",
          <input
            value={form.banner?.image ?? ""}
            onChange={(e) => set("banner.image", e.target.value)}
          />
        )}
        {row(
          "CTA text",
          <input
            value={form.banner?.ctaText ?? ""}
            onChange={(e) => set("banner.ctaText", e.target.value)}
          />
        )}
        {row(
          "CTA link",
          <input
            value={form.banner?.ctaLink ?? ""}
            onChange={(e) => set("banner.ctaLink", e.target.value)}
          />
        )}
      </section>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Quảng cáo</h4>
        {row(
          "Autoplay",
          <input
            type="checkbox"
            checked={!!form.ads?.autoplay}
            onChange={(e) => set("ads.autoplay", e.target.checked)}
          />
        )}
        {row(
          "Countdown (s)",
          <input
            type="number"
            min="3"
            max="120"
            value={form.ads?.countdown ?? 0}
            onChange={(e) =>
              set("ads.countdown", parseInt(e.target.value || "0", 10))
            }
          />
        )}
        {row(
          "Yêu cầu ở trong khung (s)",
          <input
            type="number"
            min="1"
            max="120"
            value={form.ads?.requiredWatchSec ?? 0}
            onChange={(e) =>
              set(
                "ads.requiredWatchSec",
                parseInt(e.target.value || "0", 10)
              )
            }
          />
        )}
        <div style={{ marginTop: 10 }}>
          <div style={{ opacity: 0.8, marginBottom: 6 }}>Danh sách Ads (JSON)</div>
          <textarea
            style={{ width: "100%", minHeight: 120 }}
            value={JSON.stringify(form.ads?.list ?? [], null, 2)}
            onChange={(e) => {
              try {
                set("ads.list", JSON.parse(e.target.value));
              } catch {
                // bỏ qua khi JSON chưa hợp lệ
              }
            }}
          />
        </div>
      </section>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Bonus</h4>
        {row(
          "Bật bonus",
          <input
            type="checkbox"
            checked={!!form.bonus?.enabled}
            onChange={(e) => set("bonus.enabled", e.target.checked)}
          />
        )}
        {row(
          "Sau mỗi N quảng cáo",
          <input
            type="number"
            min="1"
            max="20"
            value={form.bonus?.showAfter ?? 1}
            onChange={(e) =>
              set("bonus.showAfter", parseInt(e.target.value || "0", 10))
            }
          />
        )}
        <div style={{ marginTop: 10 }}>
          <div style={{ opacity: 0.8, marginBottom: 6 }}>Rewards (JSON)</div>
          <textarea
            style={{ width: "100%", minHeight: 80 }}
            value={JSON.stringify(form.bonus?.rewards ?? [], null, 2)}
            onChange={(e) => {
              try {
                set("bonus.rewards", JSON.parse(e.target.value));
              } catch {}
            }}
          />
        </div>
      </section>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Âm thanh</h4>
        {row(
          "Bật SFX",
          <input
            type="checkbox"
            checked={!!form.sfx?.enabled}
            onChange={(e) => set("sfx.enabled", e.target.checked)}
          />
        )}
        {row(
          "Âm lượng",
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={form.sfx?.volume ?? 0}
            onChange={(e) =>
              set("sfx.volume", parseFloat(e.target.value || "0"))
            }
          />
        )}
      </section>

      <section style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
        <h4>Backend</h4>
        {row(
          "Bật backend (DB)",
          <input
            type="checkbox"
            checked={!!form.backend?.enabled}
            onChange={(e) => set("backend.enabled", e.target.checked)}
          />
        )}
      </section>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => onSave(form)}>Lưu cấu hình</button>
        <button onClick={() => onExport()}>Xuất JSON</button>
        <button onClick={() => fileRef.current?.click()}>Nhập JSON</button>
        <input
          ref={fileRef}
          id="fileJSON"
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            await onImport(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
