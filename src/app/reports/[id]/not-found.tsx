import Link from "next/link";

export default function ReportNotFound() {
  return (
    <section className="empty-state mx-auto max-w-xl">
      <span aria-hidden="true" className="text-[2.5rem]">
        ⌕
      </span>
      <h1 className="text-[1.35rem]">Không tìm thấy tin</h1>
      <p className="text-muted">Tin này không tồn tại hoặc đã bị xóa.</p>
      <Link href="/" className="btn btn-primary">
        Xem danh sách tin
      </Link>
    </section>
  );
}
