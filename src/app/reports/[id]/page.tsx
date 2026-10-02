import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Calendar, Check, Clock, Link2, Lock, MapPin, Package, Warehouse } from "lucide-react";
import { db, reports } from "@/db";
import { ClaimBadge, StatusBadge, TypeBadge } from "@/components/ui/badges";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Notice } from "@/components/ui/notice";
import { ClaimForm } from "@/components/claims/claim-form";
import { FlagButton } from "@/components/reports/flag-button";
import { ManageActions } from "@/components/reports/manage-actions";
import { ReportVisual } from "@/components/reports/report-card";
import { authUrl } from "@/lib/auth/auth-url";
import { canManageReport } from "@/lib/auth/permissions";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { submitClaim } from "@/lib/claims/actions";
import { getMyClaimForReport, listClaimsForReport } from "@/lib/claims/query";
import { effectiveClaimStatus } from "@/lib/claims/rules";
import { flagReport } from "@/lib/flags/actions";
import { formatDate, formatDateTime, shortName, timeAgo } from "@/lib/labels";
import { countSuggestions } from "@/lib/matching/query";
import { isExpired } from "@/lib/reports/expiry";
import { imageUrl } from "@/lib/reports/images";
import { getReport, isPubliclyVisible } from "@/lib/reports/query";

export async function generateMetadata({ params }: PageProps<"/reports/[id]">): Promise<Metadata> {
  const report = await getReport((await params).id);
  return { title: report && isPubliclyVisible(report) ? report.title : "Tin đăng" };
}

export default async function ReportPage({ params, searchParams }: PageProps<"/reports/[id]">) {
  const { id } = await params;
  const { created, updated } = await searchParams;
  const [report, viewer] = await Promise.all([getReport(id), getCurrentUser()]);
  if (!report) notFound();
  const isOwner = viewer?.id === report.userId;
  const admin = isAdmin(viewer);
  // Tin bị ẩn chỉ chủ tin và ADMIN xem được
  if (!isPubliclyVisible(report) && !isOwner && !admin) notFound();

  const expired = isExpired(report.expiresAt);
  const found = report.type === "FOUND";
  const canManage = canManageReport(viewer, report);
  const myClaim = viewer && !isOwner && found ? await getMyClaimForReport(report.id, viewer.id) : null;
  const claimable = found && !isOwner && report.status === "OPEN" && !expired && !myClaim;
  const claims = isOwner && found ? (await listClaimsForReport(report.id)).map((c) => ({ ...c, status: effectiveClaimStatus(c) })) : [];
  const pending = claims.filter((c) => c.status === "PENDING");
  const accepted = claims.find((c) => c.status === "ACCEPTED" || c.status === "COMPLETED");
  const suggestions = isOwner ? await countSuggestions(report.id) : 0;
  // Chỉ lấy câu hỏi (không lấy đáp án) và chỉ cho người sẽ gửi yêu cầu
  const question = claimable && viewer
    ? (await db.select({ q: reports.verifyQuestion }).from(reports).where(and(eq(reports.id, report.id)))).at(0)?.q
    : null;
  const [hero, ...rest] = report.images;

  return (
    <div className="pb-24 max-[744px]:pb-28">
      <div className="flex items-center justify-between gap-4 pb-4 pt-6 max-[744px]:pt-4">
        <Link href={`/${report.type === "LOST" ? "?type=LOST" : "?type=FOUND"}`} className="icon-btn" aria-label="Về bảng tin">
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        {canManage && <ManageActions id={report.id} status={report.status} />}
      </div>

      <div className="mb-6 grid gap-3 empty:hidden">
        {created && <Notice tone="success">Đăng tin thành công. Hệ thống sẽ báo cho bạn khi có tin phù hợp.</Notice>}
        {updated && <Notice tone="success">Đã lưu thay đổi.</Notice>}
        {report.status === "HIDDEN" && <Notice tone="warn">Tin này đã bị quản trị viên ẩn khỏi bảng tin.</Notice>}
      </div>

      {hero ? (
        <div className="grid gap-2">
          <a href={imageUrl(hero)} target="_blank" rel="noreferrer" className="block">
            <ReportVisual type={report.type} path={hero} className="aspect-[16/7] w-full max-[744px]:aspect-video" />
          </a>
          {rest.length > 0 && (
            <ul className="grid grid-cols-5 gap-2 max-[744px]:grid-cols-4">
              {rest.map((p, i) => (
                <li key={p}>
                  <a href={imageUrl(p)} target="_blank" rel="noreferrer" aria-label={`Ảnh ${i + 2}`} className="block">
                    <ReportVisual type={report.type} path={p} className="aspect-square w-full rounded-sm" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <ReportVisual type={report.type} category={report.categoryName} className="aspect-[16/5] w-full max-[744px]:aspect-video" iconClassName="size-14" />
      )}

      <div className="grid grid-cols-[minmax(0,1fr)_372px] items-start gap-[72px] pt-8 max-[1128px]:grid-cols-[minmax(0,1fr)_340px] max-[1128px]:gap-12 max-[744px]:grid-cols-1 max-[744px]:gap-0 max-[744px]:pt-6">
        <div className="[&>section]:border-b [&>section]:border-line [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:border-b-0">
          <section>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={report.type} />
              <StatusBadge status={report.status} expired={expired} />
            </div>
            <h1 className="mt-4 text-[1.625rem] font-semibold max-[744px]:text-[1.375rem]">{report.title}</h1>
            <p className="mt-3 text-[0.9375rem] text-muted">
              {report.locationName} · Đăng {timeAgo(report.createdAt)} bởi {shortName(report.ownerName)}
            </p>
          </section>

          <section>
            <h2 className="mb-5">Thông tin</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 max-[744px]:grid-cols-1">
              <Fact icon={<CategoryIcon name={report.categoryName} className="size-6" />} label="Danh mục" value={report.categoryName} />
              <Fact icon={<MapPin className="size-6" aria-hidden />} label="Khu vực" value={report.locationName} sub={report.schoolName} />
              <Fact icon={<Calendar className="size-6" aria-hidden />} label={found ? "Ngày nhặt được" : "Ngày xảy ra"} value={formatDate(report.eventTime)} />
              <Fact icon={<Clock className="size-6" aria-hidden />} label="Đăng lúc" value={formatDateTime(report.createdAt)} />
              {found && report.keepingPlace && <Fact icon={<Warehouse className="size-6" aria-hidden />} label="Đang giữ tại" value={report.keepingPlace} />}
              <Fact icon={<Package className="size-6" aria-hidden />} label="Hết hạn" value={expired ? "Đã hết hạn" : formatDate(report.expiresAt)} />
            </dl>
          </section>

          <section>
            <h2 className="mb-5">Mô tả</h2>
            <p className="max-w-[68ch] whitespace-pre-line text-body">{report.description}</p>
          </section>

          {isOwner && found && (
            <section id="claims">
              <h2 className="mb-5">Yêu cầu nhận lại</h2>
              <div className="mb-6 flex items-start gap-3 rounded-md bg-surface-soft px-4 py-3.5 text-[0.875rem] text-body">
                <Lock className="mt-px size-5 shrink-0" aria-hidden />
                <span>
                  Chỉ bạn thấy thông tin xác minh. Đối chiếu với đồ đang giữ trước khi chấp nhận; <strong className="text-ink">điểm trùng khớp không phải bằng chứng sở hữu.</strong>
                </span>
              </div>
              {claims.length ? (
                <ul>
                  {claims.map((c, i) => (
                    <li key={c.id} className={`flex flex-wrap items-center gap-3 py-5 ${i ? "border-t border-line-soft" : "pt-0"}`}>
                      <span className="grid size-[30px] place-items-center rounded-full bg-ink text-[0.75rem] font-semibold text-white" aria-hidden>
                        {shortName(c.claimantName)[0]}
                      </span>
                      <span className="font-semibold">{shortName(c.claimantName)}</span>
                      <span className="text-[0.875rem] text-muted">gửi {timeAgo(c.createdAt)}</span>
                      <span className="ml-auto">
                        <ClaimBadge status={c.status} />
                      </span>
                      <Link href={`/claims/${c.id}`} className={`btn btn-sm ${c.status === "PENDING" ? "btn-primary" : "btn-secondary"}`}>
                        {c.status === "PENDING" ? "Xem và duyệt" : "Xem"}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Chưa có ai gửi yêu cầu. Tin đang hiển thị trên bảng tin.</p>
              )}
            </section>
          )}

          <section>
            <h2 className="mb-5">Người đăng</h2>
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full bg-ink text-[1.125rem] font-semibold text-white" aria-hidden>
                {shortName(report.ownerName)[0]}
              </span>
              <div>
                <p className="font-semibold">{shortName(report.ownerName)}</p>
                <p className="text-[0.875rem] text-muted">
                  Tham gia {new Intl.DateTimeFormat("vi-VN", { month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(report.ownerSince)} · {report.ownerReports} tin đang hiển thị
                </p>
              </div>
            </div>
            <p className="mt-4 text-[0.8125rem] text-muted">UniFound không hiển thị số điện thoại hay email trên tin.</p>
          </section>
        </div>

        <aside id="rail" aria-label="Hành động với tin" className="sticky top-16 grid gap-4 max-[744px]:static max-[744px]:pt-6">
          {!viewer && found && report.status === "OPEN" && !expired && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Đây có phải đồ của bạn?</h3>
              <p className="text-[0.875rem] text-muted">Đăng nhập để gửi yêu cầu nhận lại kèm thông tin xác minh riêng tư.</p>
              <Link href={authUrl("login", {}, `/reports/${report.id}`)} className="btn btn-primary btn-block">
                Đăng nhập để gửi yêu cầu
              </Link>
              <p className="text-[0.875rem] text-muted">
                Chưa có tài khoản?{" "}
                <Link href={authUrl("register", {}, `/reports/${report.id}`)} className="text-ink">
                  Tạo tài khoản
                </Link>
              </p>
            </div>
          )}

          {!viewer && !found && report.status === "OPEN" && !expired && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Bạn nhặt được món đồ này?</h3>
              <p className="text-[0.875rem] text-muted">Đăng nhập rồi đăng tin Nhặt được để hệ thống gợi ý tin của bạn cho chủ đồ.</p>
              <Link href={authUrl("login", { next: "/reports/new?type=FOUND" }, `/reports/${report.id}`)} className="btn btn-primary btn-block">
                Đăng nhập
              </Link>
            </div>
          )}

          {claimable && viewer && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Gửi yêu cầu nhận lại</h3>
              <ClaimForm action={submitClaim.bind(null, report.id)} question={question ?? "Mô tả đặc điểm riêng của món đồ."} userId={viewer.id} />
            </div>
          )}

          {viewer && !isOwner && found && !claimable && !myClaim && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Tin không nhận yêu cầu</h3>
              <p className="text-[0.875rem] text-muted">Tin này đang bàn giao, đã trả, đã đóng hoặc hết hạn nên không nhận thêm yêu cầu.</p>
            </div>
          )}

          {myClaim && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Yêu cầu của bạn</h3>
              <ClaimSteps status={effectiveClaimStatus(myClaim)} sentAt={myClaim.createdAt} />
              <hr className="border-line" />
              <Link href={`/claims/${myClaim.id}`} className="btn btn-secondary btn-block">
                Xem yêu cầu đã gửi
              </Link>
            </div>
          )}

          {viewer && !isOwner && !found && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Bạn nhặt được món đồ này?</h3>
              <p className="text-[0.875rem] text-muted">Đăng tin Nhặt được, hệ thống sẽ gợi ý tin của bạn cho chủ đồ kèm lý do.</p>
              <Link href="/reports/new?type=FOUND" className="btn btn-primary btn-block">
                Đăng tin Nhặt được
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="rail">
              <h3 className="text-[1.25rem]">{accepted?.status === "ACCEPTED" ? "Chờ trao trả" : report.status === "RETURNED" ? "Đã hoàn tất" : "Tin của bạn"}</h3>
              {found ? (
                accepted ? (
                  <>
                    <p className="text-[0.875rem] text-muted">
                      {accepted.status === "COMPLETED"
                        ? `Đồ đã được trả cho ${shortName(accepted.claimantName)} (tin không nhận yêu cầu mới).`
                        : `Bạn đã chấp nhận yêu cầu của ${shortName(accepted.claimantName)}. Đặt điểm hẹn và xác nhận sau khi trao đồ.`}
                    </p>
                    <Link href={`/claims/${accepted.id}`} className="btn btn-primary btn-block">
                      {accepted.status === "COMPLETED" ? "Xem lại bàn giao" : "Mở bàn giao"}
                    </Link>
                  </>
                ) : pending.length ? (
                  <>
                    <p className="text-[0.875rem] text-muted">
                      <strong className="text-ink">{pending.length} yêu cầu</strong> đang chờ bạn đối chiếu.
                    </p>
                    <a href="#claims" className="btn btn-primary btn-block">
                      Xem yêu cầu
                    </a>
                  </>
                ) : (
                  <p className="text-[0.875rem] text-muted">Chưa có yêu cầu nào. Tin đang hiển thị trên bảng tin.</p>
                )
              ) : (
                <p className="text-[0.875rem] text-muted">Hệ thống tự tìm tin Nhặt được phù hợp và báo cho bạn.</p>
              )}
              {suggestions > 0 && (
                <>
                  <hr className="border-line" />
                  <Link href={`/matches?report=${report.id}`} className="btn btn-text justify-start">
                    <Link2 className="size-4" aria-hidden />
                    {suggestions} tin {found ? "mất đồ" : "nhặt được"} có thể liên quan
                  </Link>
                </>
              )}
            </div>
          )}

          {admin && !isOwner && (
            <div className="rail">
              <h3 className="text-[1.25rem]">Quản trị viên</h3>
              <ManageActions id={report.id} status={report.status} />
            </div>
          )}

          {viewer && !isOwner && report.status !== "HIDDEN" && <FlagButton action={flagReport.bind(null, report.id)} />}
          {!viewer && report.status !== "HIDDEN" && (
            <Link href={authUrl("login", {}, `/reports/${report.id}`)} className="text-[0.8125rem] font-semibold text-muted">
              Đăng nhập để báo cáo tin vi phạm
            </Link>
          )}
        </aside>
      </div>

      <MobileBar>
        {!viewer ? (
          <>
            <div>
              <div className="text-[0.875rem] font-semibold leading-tight">{found ? "Đây có phải đồ của bạn?" : "Bạn nhặt được món đồ này?"}</div>
              <div className="text-[0.75rem] text-muted">Cần đăng nhập</div>
            </div>
            <Link href={authUrl("login", {}, `/reports/${report.id}`)} className="btn btn-primary">
              Đăng nhập
            </Link>
          </>
        ) : claimable ? (
          <>
            <div>
              <div className="text-[0.875rem] font-semibold leading-tight">Nhặt được · {report.locationName}</div>
              <div className="text-[0.75rem] text-muted">Thông tin xác minh là riêng tư</div>
            </div>
            <a href="#rail" className="btn btn-primary">
              Gửi yêu cầu
            </a>
          </>
        ) : myClaim ? (
          <>
            <div className="text-[0.875rem] font-semibold">Đã gửi yêu cầu</div>
            <ClaimBadge status={effectiveClaimStatus(myClaim)} />
          </>
        ) : isOwner && pending.length ? (
          <>
            <div>
              <div className="text-[0.875rem] font-semibold leading-tight">{pending.length} yêu cầu chờ duyệt</div>
              <div className="text-[0.75rem] text-muted">Đối chiếu trước khi chấp nhận</div>
            </div>
            <a href="#claims" className="btn btn-primary">
              Xem
            </a>
          </>
        ) : null}
      </MobileBar>
    </div>
  );
}

function Fact({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string | null }) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div>
        <dt className="text-[0.875rem] text-muted">{label}</dt>
        <dd className="tabular mt-0.5 font-medium">{value}</dd>
        {sub && <dd className="text-[0.8125rem] text-muted">{sub}</dd>}
      </div>
    </div>
  );
}

/** Thanh hành động cố định cuối màn hình điện thoại; không có nội dung thì không hiện. */
function MobileBar({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 hidden items-center justify-between gap-4 border-t border-line bg-canvas px-6 py-3 max-[744px]:flex">{children}</div>
  );
}

function ClaimSteps({ status, sentAt }: { status: ReturnType<typeof effectiveClaimStatus>; sentAt: Date }) {
  if (status === "REJECTED" || status === "EXPIRED") {
    return <Notice tone="warn">{status === "REJECTED" ? "Yêu cầu không được chấp nhận hoặc tin đã chọn người khác." : "Yêu cầu quá 7 ngày không được phản hồi nên đã hết hạn."}</Notice>;
  }
  const accepted = status === "ACCEPTED" || status === "COMPLETED";
  const steps = [
    { t: "Đã gửi yêu cầu", d: formatDateTime(sentAt), state: "done" },
    { t: "Chủ tin đối chiếu", d: "Bạn sẽ thấy kết quả tại “Tin của tôi”.", state: accepted ? "done" : "now" },
    { t: "Được chấp nhận", d: "", state: status === "COMPLETED" ? "done" : status === "ACCEPTED" ? "now" : "todo" },
    { t: "Nhận lại đồ", d: "", state: status === "COMPLETED" ? "done" : "todo" },
  ];
  return (
    <ol className="grid">
      {steps.map((s, i) => (
        <li key={s.t} className="relative grid grid-cols-[24px_1fr] gap-3 pb-4 text-[0.875rem] last:pb-0">
          {i < steps.length - 1 && <span className={`absolute bottom-0 left-[11px] top-6 w-0.5 ${s.state === "done" ? "bg-ink" : "bg-line"}`} aria-hidden />}
          <span
            className={`z-[1] grid size-6 place-items-center rounded-full border-2 ${
              s.state === "done" ? "border-ink bg-ink text-white" : s.state === "now" ? "border-primary bg-primary shadow-[inset_0_0_0_4px_#fff]" : "border-line bg-canvas"
            }`}
            aria-hidden
          >
            {s.state === "done" && <Check className="size-3.5" strokeWidth={2.4} />}
          </span>
          <span className={`font-semibold leading-6 ${s.state === "todo" ? "font-medium text-muted" : ""}`}>
            {s.t}
            {s.d && <span className="tabular block font-normal leading-snug text-muted">{s.d}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
