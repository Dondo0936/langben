import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <p className="text-sm text-muted">404</p>
      <p className="font-medium">Không tìm thấy trang.</p>
      <Link href="/" className="text-sm text-accent">Về trang chủ</Link>
    </div>
  );
}
