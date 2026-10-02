/** Nội dung Trung tâm trợ giúp (bố cục theo iLost Support Center) và điểm tiếp nhận, dùng chung cho HelpWidget và footer. */

export type HelpArticle = { id: string; group: "lost" | "found"; title: string; intro: string; steps: string[] };

export const HELP_GROUPS = {
  lost: { title: "Tôi bị mất đồ", lede: "Các bài giúp bạn đăng tin và tìm lại món đồ đã mất." },
  found: { title: "Tôi nhặt được đồ", lede: "Các bài giúp bạn đăng tin nhặt được và trả lại đồ cho đúng chủ." },
} as const;

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "lost-post",
    group: "lost",
    title: "Cách đăng tin Mất đồ",
    intro: "Tin Mất đồ càng cụ thể thì càng dễ được người nhặt nhận ra.",
    steps: [
      "Đăng nhập bằng email do trường cấp, rồi bấm “Đăng tin” và chọn “Mất đồ”.",
      "Nhập tiêu đề, chọn danh mục, địa điểm và ngày bị mất.",
      "Mô tả đặc điểm dễ nhận biết (màu sắc, nhãn hiệu, vết xước…) và thêm ảnh nếu có.",
      "Bấm “Đăng tin”. Tin hiển thị công khai trên bảng tin trong 60 ngày.",
    ],
  },
  {
    id: "lost-match",
    group: "lost",
    title: "Gợi ý trùng khớp hoạt động thế nào?",
    intro: "Sau khi bạn đăng tin, hệ thống so sánh với các tin Nhặt được đang mở.",
    steps: [
      "Hệ thống chỉ xét tin loại đối ứng, cùng danh mục, còn mở và đăng trong 14 ngày, rồi chấm điểm theo địa điểm, trường, thời gian và từ khóa trong tiêu đề, mô tả.",
      "Tin phù hợp xuất hiện ở mục “Gợi ý trùng khớp” và bạn nhận thông báo trong web.",
      "Gợi ý chỉ để tham khảo, không phải xác nhận sở hữu. Bạn có thể bỏ qua gợi ý không đúng.",
    ],
  },
  {
    id: "lost-claim",
    group: "lost",
    title: "Cách gửi yêu cầu nhận lại đồ",
    intro: "Khi thấy tin Nhặt được có thể là đồ của mình, hãy gửi yêu cầu kèm thông tin xác minh.",
    steps: [
      "Mở chi tiết tin Nhặt được và trả lời câu hỏi xác minh mà người nhặt đặt ra.",
      "Bấm “Gửi yêu cầu”. Mỗi người chỉ gửi một yêu cầu cho một tin.",
      "Người nhặt có 7 ngày để chấp nhận hoặc từ chối; bạn theo dõi trạng thái ở “Tin và yêu cầu của tôi”.",
    ],
  },
  {
    id: "found-post",
    group: "found",
    title: "Cách đăng tin Nhặt được",
    intro: "Đăng tin để chủ đồ có thể tìm thấy và liên hệ với bạn.",
    steps: [
      "Đăng nhập, bấm “Đăng tin” và chọn “Nhặt được”.",
      "Nhập tiêu đề, danh mục, nơi nhặt được và nơi bạn đang giữ đồ.",
      "Đặt một câu hỏi xác minh kèm đáp án (chỉ bạn thấy). Không đưa chi tiết riêng tư của món đồ vào mô tả công khai.",
      "Bấm “Đăng tin”. Bạn có thể sửa, đóng hoặc xóa tin ở “Tin và yêu cầu của tôi”.",
    ],
  },
  {
    id: "found-decide",
    group: "found",
    title: "Xử lý yêu cầu nhận đồ",
    intro: "Khi có người gửi yêu cầu, bạn đối chiếu câu trả lời với đáp án của mình.",
    steps: [
      "Mở thông báo hoặc mục “Tin và yêu cầu của tôi” để xem yêu cầu.",
      "Nếu câu trả lời khớp, bấm “Chấp nhận”; nếu chưa chắc chắn hoặc sai, bấm “Từ chối”.",
      "Yêu cầu không được phản hồi sau 7 ngày sẽ tự hết hạn.",
    ],
  },
  {
    id: "found-handover",
    group: "found",
    title: "Bàn giao và xác nhận Đã trả",
    intro: "Sau khi chấp nhận, hai bên thống nhất cách trao đổi món đồ.",
    steps: [
      "Chọn điểm hẹn trong khuôn viên và để lại cách liên hệ; hai bên chỉ thấy thông tin của nhau sau khi yêu cầu được chấp nhận.",
      "Ưu tiên gặp ở nơi đông người hoặc gửi tại điểm tiếp nhận bên dưới.",
      "Khi đã trao đồ, cả hai bên cùng xác nhận “Đã trả”; đủ hai xác nhận thì tin được đóng.",
    ],
  },
];

export const RECEPTION_POINTS = [
  { name: "Phòng bảo vệ cổng UIT", note: "Khu phố 6, P. Linh Xuân, TP. Thủ Đức" },
  { name: "Quầy thủ thư Thư viện UIT", note: "Tầng 1" },
  { name: "Nhà văn hóa Sinh viên ĐHQG-HCM", note: "Khu đô thị ĐHQG-HCM" },
  { name: "Ký túc xá ĐHQG-HCM (khu A, khu B)", note: "Phòng quản lý / bảo vệ KTX" },
];
