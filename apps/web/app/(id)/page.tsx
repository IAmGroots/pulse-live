import { Landing } from "@/components/landing";
import { getMessages } from "@/lib/i18n";

export default function IdHome() {
  return <Landing locale="id" messages={getMessages("id")} />;
}
