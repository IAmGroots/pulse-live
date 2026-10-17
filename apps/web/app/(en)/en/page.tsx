import { Landing } from "@/components/landing";
import { getMessages } from "@/lib/i18n";

export default function EnHome() {
  return <Landing locale="en" messages={getMessages("en")} />;
}
