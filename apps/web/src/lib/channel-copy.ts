import type { ChannelType } from "./types.ts";

/** Short hint under the channel form. SDK channels must not talk about webhook HMAC. */
export function signatureHint(type: ChannelType): string {
  if (type === "viettel" || type === "msteams") {
    return "Kênh này đi SDK / OTLP, không kiểm chữ ký webhook messenger.";
  }
  if (type === "lark") return "Verification token sai thì webhook trả 401, không tạo lượt.";
  if (type === "gchat") return "Bearer token sai thì webhook trả 401, không tạo lượt.";
  if (type === "fpt") return "HMAC sai thì webhook trả 401, không tạo lượt.";
  if (type === "zalo_bot") return "Secret Token sai thì webhook trả 401, không tạo lượt.";
  return "Chữ ký OA-MAC sai thì webhook trả 401, không tạo lượt.";
}
