"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <p className="font-medium">Không tải được dữ liệu.</p>
      <button onClick={reset} className="btn-solid">
        Thử lại
      </button>
    </div>
  );
}
