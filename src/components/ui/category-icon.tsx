import {
  BookOpen,
  CircleEllipsis,
  CreditCard,
  CupSoda,
  Headphones,
  KeyRound,
  Laptop,
  Shirt,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/tai nghe|phụ kiện điện tử/i, Headphones],
  [/laptop|máy tính/i, Laptop],
  [/điện thoại|điện tử/i, Smartphone],
  [/thẻ/i, CreditCard],
  [/ví|giấy tờ/i, Wallet],
  [/chìa|khóa/i, KeyRound],
  [/bình|nước/i, CupSoda],
  [/sách|tài liệu|dụng cụ/i, BookOpen],
  [/quần|áo|phụ kiện/i, Shirt],
];

/** Icon theo tên danh mục (danh mục do admin tự thêm nên dò theo từ khóa, mặc định là dấu ba chấm). */
export function categoryIcon(name?: string | null): LucideIcon {
  if (!name) return CircleEllipsis;
  return RULES.find(([re]) => re.test(name))?.[1] ?? CircleEllipsis;
}

export function CategoryIcon({ name, className = "size-6" }: { name?: string | null; className?: string }) {
  const Icon = categoryIcon(name);
  return <Icon className={className} aria-hidden />;
}
