export default function ReportDetailLoading() {
  return (
    <div aria-busy="true" className="grid gap-5">
      <p className="sr-only" role="status">
        Đang tải tin…
      </p>
      <div aria-hidden="true" className="grid gap-5">
        <div className="h-10 w-44 animate-pulse rounded-xl bg-line" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.75fr)]">
          <div className="panel grid gap-4">
            <div className="h-[200px] animate-pulse rounded-2xl bg-surface-soft sm:h-[260px]" />
            <div className="h-6 w-40 animate-pulse rounded-full bg-line" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-line" />
            <div className="h-4 w-full animate-pulse rounded bg-line" />
          </div>
          <div className="grid content-start gap-4">
            <div className="h-44 animate-pulse rounded-[1.4rem] bg-line" />
            <div className="h-24 animate-pulse rounded-2xl bg-primary-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
