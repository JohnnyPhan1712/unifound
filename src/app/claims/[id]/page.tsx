import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, Clock, LockKeyhole, MapPin, Phone } from "lucide-react";
import { ClaimBadge, TypeBadge } from "@/components/ui/badges";
import { Notice } from "@/components/ui/notice";
import { DecisionButtons } from "@/components/claims/decision-buttons";
import { ConfirmHandoverButton, MeetingForm } from "@/components/claims/handover";
import { ReportVisual } from "@/components/reports/report-card";
import { requireUser } from "@/lib/auth/session";
import { canViewClaim, getClaimDetail, getHandoverContacts, type ClaimDetail } from "@/lib/claims/query";
import { canSeeContacts } from "@/lib/claims/handover";
import { getCatalogOptions } from "@/lib/reports/catalog";
import { toLocalDateTime } from "@/lib/reports/schemas";
import { CLAIM_TTL_DAYS, effectiveClaimStatus } from "@/lib/claims/rules";
import { formatDate, formatDateTime } from "@/lib/labels";

export const metadata: Metadata = { title: "Yêu cầu nhận đồ" };

export default async function ClaimDetailPage({ params, searchParams }: PageProps<"/claims/[id]">) {
  const { id } = await params;
  const { sent } = await searchParams;
  const user = await requireUser();
  const claim = await getClaimDetail(id);
  // Người thứ ba nhận 404 để không lộ cả việc yêu cầu tồn tại
  if (!claim || !canViewClaim(claim, user.id)) notFound();

  const isFinder = claim.report.userId === user.id;
  const status = effectiveClaimStatus(claim);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8 pt-8">
      {sent && <Notice tone="success">Đã gửi yêu cầu. Người nhặt sẽ xem câu trả lời và phản hồi cho bạn.</Notice>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Yêu cầu nhận đồ</h1>
        <ClaimBadge status={status} />
      </div>

      <Link href={`/reports/${claim.report.id}`} className="panel flex items-center gap-4 p-4 text-ink no-underline hover:border-control">
        <ReportVisual type={claim.report.type} path={claim.report.cover} className="aspect-square w-20 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-col items-start gap-1">
          <TypeBadge type={claim.report.type} />
          <span className="max-w-full truncate font-semibold">{claim.report.title}</span>
          <span className="text-[0.8125rem] text-muted">{isFinder ? "Tin của bạn" : "Tin bạn gửi yêu cầu"}</span>
        </div>
      </Link>

      <NextStep claim={claim} status={status} isFinder={isFinder} />

      <section className="panel flex flex-col gap-4" aria-labelledby="verify">
        <h2 id="verify" className="flex items-center gap-2 text-[1.05rem]">
          <LockKeyhole className="size-4 text-primary" aria-hidden />
          Thông tin xác minh (riêng tư)
        </h2>
        <p className="-mt-2 text-[0.8125rem] text-muted">Chỉ người gửi yêu cầu và người nhặt đồ thấy phần này.</p>
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="label text-muted">Câu hỏi</dt>
            <dd>{claim.report.verifyQuestion}</dd>
          </div>
          {isFinder && (
            <div>
              <dt className="label text-muted">Đáp án bạn đã đặt</dt>
              <dd>{claim.report.verifyAnswer}</dd>
            </div>
          )}
          <div>
            <dt className="label text-muted">Câu trả lời {isFinder ? `của ${claim.claimantName ?? "người gửi"}` : "của bạn"}</dt>
            <dd className="whitespace-pre-line font-semibold">{claim.answerText}</dd>
          </div>
          {claim.note && (
            <div>
              <dt className="label text-muted">Mô tả thêm</dt>
              <dd className="whitespace-pre-line">{claim.note}</dd>
            </div>
          )}
          <div>
            <dt className="label text-muted">Gửi lúc</dt>
            <dd>{formatDateTime(claim.createdAt)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function NextStep({ claim, status, isFinder }: { claim: ClaimDetail; status: ReturnType<typeof effectiveClaimStatus>; isFinder: boolean }) {
  if (status === "PENDING") {
    const deadline = new Date(claim.createdAt.getTime() + CLAIM_TTL_DAYS * 86_400_000);
    return isFinder ? (
      <section className="panel flex flex-col gap-3">
        <h2 className="text-[1.05rem]">Bước tiếp theo: xem câu trả lời và quyết định</h2>
        <p className="text-muted">
          So câu trả lời bên dưới với đáp án bạn đã đặt. Chấp nhận thì các yêu cầu khác của tin tự đóng. Yêu cầu hết hạn ngày {formatDate(deadline)}.
        </p>
        <DecisionButtons id={claim.id} />
      </section>
    ) : (
      <Notice tone="info">Đang chờ người nhặt phản hồi. Yêu cầu tự hết hạn ngày {formatDate(deadline)} nếu không được xử lý.</Notice>
    );
  }
  if (status === "REJECTED") {
    return <Notice tone="warn">{isFinder ? "Bạn đã từ chối yêu cầu này." : "Yêu cầu không được chấp nhận hoặc tin đã chọn người khác."}</Notice>;
  }
  if (status === "EXPIRED") return <Notice tone="warn">Yêu cầu đã quá {CLAIM_TTL_DAYS} ngày không được phản hồi nên đã hết hạn.</Notice>;
  if (status === "COMPLETED") return <Notice tone="success">Đã bàn giao xong. Tin đã chuyển sang Đã trả.</Notice>;
  return <HandoverSection claim={claim} isFinder={isFinder} />;
}

async function HandoverSection({ claim, isFinder }: { claim: ClaimDetail; isFinder: boolean }) {
  // Trang đã kiểm tra người xem là một trong hai bên; liên hệ chỉ lộ khi ACCEPTED
  if (!canSeeContacts(claim.status)) return null;
  const [{ finder, owner }, { locations }] = await Promise.all([getHandoverContacts(claim), getCatalogOptions()]);
  const myConfirmed = isFinder ? claim.finderConfirmedAt : claim.ownerConfirmedAt;
  const otherConfirmed = isFinder ? claim.ownerConfirmedAt : claim.finderConfirmedAt;

  return (
    <section className="panel flex flex-col gap-5" aria-labelledby="handover">
      <div>
        <h2 id="handover" className="text-[1.05rem]">
          Bàn giao đồ
        </h2>
        <p className="text-muted">
          {isFinder
            ? "Liên hệ người nhận, chọn điểm và giờ hẹn. Sau khi đưa đồ, bấm “Đã trả đồ”."
            : "Liên hệ người nhặt và đến đúng hẹn. Sau khi nhận đồ, bấm “Đã nhận đồ”."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Người nhặt", u: finder },
          { label: "Người nhận", u: owner },
        ].map(({ label, u }) => (
          <div key={label} className="rounded-lg border border-line p-3">
            <p className="text-[0.75rem] font-semibold text-muted">{label}</p>
            <p className="font-semibold">{u?.fullName ?? "Chưa cập nhật họ tên"}</p>
            <p className="flex items-center gap-1.5 text-[0.88rem]">
              <Phone className="size-3.5 text-muted" aria-hidden />
              {u?.contactInfo ?? "Chưa cập nhật liên hệ"}
            </p>
            <p className="break-all text-[0.8125rem] text-muted">{u?.email}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <h3 className="flex items-center gap-2">
          <MapPin className="size-4 text-muted" aria-hidden />
          Lịch hẹn
        </h3>
        {claim.meetLocationName && claim.meetTime ? (
          <p className="font-semibold">
            {claim.meetLocationName} · {formatDateTime(claim.meetTime)}
          </p>
        ) : (
          <p className="text-muted">{isFinder ? "Chưa đặt lịch hẹn." : "Người nhặt chưa đặt lịch hẹn."}</p>
        )}
        {isFinder && (
          <MeetingForm
            id={claim.id}
            locations={locations}
            minDateTime={toLocalDateTime(new Date())}
            initial={{
              meetLocationId: claim.meetLocationId ?? undefined,
              meetTime: claim.meetTime ? toLocalDateTime(claim.meetTime) : undefined,
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <h3>Xác nhận hai bên</h3>
        <ul className="flex flex-col gap-1 text-[0.88rem]">
          <ConfirmLine label="Người nhặt xác nhận đã trả" at={claim.finderConfirmedAt} />
          <ConfirmLine label="Người nhận xác nhận đã nhận" at={claim.ownerConfirmedAt} />
        </ul>
        {myConfirmed ? (
          <Notice tone="info">{otherConfirmed ? "Hai bên đã xác nhận." : "Bạn đã xác nhận. Chờ bên còn lại xác nhận để hoàn tất."}</Notice>
        ) : (
          <ConfirmHandoverButton id={claim.id} label={isFinder ? "Đã trả đồ" : "Đã nhận đồ"} />
        )}
      </div>
    </section>
  );
}

function ConfirmLine({ label, at }: { label: string; at: Date | null }) {
  return (
    <li className={`flex items-center gap-2 ${at ? "text-found" : "text-muted"}`}>
      {at ? <CircleCheck className="size-4" aria-hidden /> : <Clock className="size-4" aria-hidden />}
      {label}
      {at ? ` · ${formatDateTime(at)}` : " · chưa"}
    </li>
  );
}
