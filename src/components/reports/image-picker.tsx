"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { IMAGE_BUCKET, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGES } from "@/lib/reports/schemas";

type Item = { key: string; preview: string; path?: string; error?: string };

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * Tải ảnh thẳng từ trình duyệt lên Supabase Storage (tránh giới hạn body của server action/Vercel),
 * rồi gửi danh sách đường dẫn qua input ẩn `images`; server kiểm tra lại từng ảnh.
 */
export function ImagePicker({
  userId,
  error,
  onBusyChange,
}: {
  userId: string;
  error?: string[];
  onBusyChange: (busy: boolean) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setMessage(undefined);
    const room = MAX_IMAGES - items.length;
    const picked = Array.from(files);
    if (picked.length > room) setMessage(`Tối đa ${MAX_IMAGES} ảnh; đã bỏ bớt ${picked.length - room} ảnh.`);
    const accepted = picked.slice(0, Math.max(room, 0)).filter((f) => {
      if (!IMAGE_TYPES.includes(f.type)) return setMessage(`"${f.name}" không phải ảnh JPG, PNG hoặc WEBP.`), false;
      if (f.size > MAX_IMAGE_BYTES) return setMessage(`"${f.name}" lớn hơn 5 MB.`), false;
      return true;
    });
    if (inputRef.current) inputRef.current.value = "";
    if (!accepted.length) return;

    const fresh = accepted.map((f) => ({ key: crypto.randomUUID(), preview: URL.createObjectURL(f), file: f }));
    setItems((prev) => [...prev, ...fresh.map(({ key, preview }) => ({ key, preview }))]);
    onBusyChange(true);
    const supabase = createClient();
    await Promise.all(
      fresh.map(async ({ key, file }) => {
        const path = `${userId}/${crypto.randomUUID()}.${EXT[file.type]}`;
        const { error: upErr } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type });
        setItems((prev) =>
          prev.map((it) => (it.key === key ? { ...it, ...(upErr ? { error: "Tải lên thất bại" } : { path }) } : it))
        );
      })
    );
    onBusyChange(false);
  }

  // ponytail: ảnh bỏ khỏi danh sách hoặc form bị hủy vẫn nằm trong Storage; dọn khi cần bằng job theo report_images.
  function remove(key: string) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  const paths = items.flatMap((it) => (it.path ? [it.path] : []));
  const shownError = message ?? error?.[0];

  return (
    <div>
      <span className="label" id="images-label">
        Ảnh đồ vật <span className="text-danger" aria-hidden>*</span>
      </span>
      <input type="hidden" name="images" value={JSON.stringify(paths)} />
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5" aria-labelledby="images-label">
        {items.map((it) => (
          <li key={it.key} className="relative aspect-square overflow-hidden rounded-sm border border-line bg-surface-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.preview} alt="" className="size-full object-cover" />
            {!it.path && !it.error && (
              <span className="absolute inset-0 grid place-items-center bg-white/60">
                <LoaderCircle className="size-5 animate-spin text-primary" aria-label="Đang tải ảnh" />
              </span>
            )}
            {it.error && (
              <span className="absolute inset-x-0 bottom-0 bg-danger px-1 py-0.5 text-center text-[0.75rem] text-white">{it.error}</span>
            )}
            <button
              type="button"
              onClick={() => remove(it.key)}
              className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/90 text-ink shadow-chip"
              aria-label="Bỏ ảnh này"
            >
              <X className="size-4" aria-hidden />
            </button>
          </li>
        ))}
        {items.length < MAX_IMAGES && (
          <li>
            <label
              className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed text-center text-[0.8125rem] font-semibold ${
                shownError ? "border-danger text-danger" : "border-control text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <ImagePlus className="size-6" aria-hidden />
              Thêm ảnh
              <input
                ref={inputRef}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                multiple
                className="sr-only"
                onChange={(e) => onPick(e.target.files)}
                aria-describedby="images-help"
              />
            </label>
          </li>
        )}
      </ul>
      <p id="images-help" className={`mt-1.5 text-[0.8125rem] ${shownError ? "font-medium text-danger" : "text-muted"}`} role={shownError ? "alert" : undefined}>
        {shownError ?? `1–${MAX_IMAGES} ảnh JPG, PNG hoặc WEBP, mỗi ảnh tối đa 5 MB.`}
      </p>
    </div>
  );
}
