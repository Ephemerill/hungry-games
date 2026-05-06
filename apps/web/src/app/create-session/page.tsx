import { AiHealthNotice } from "@/components/AiHealthNotice";
import { TributeUploadForm } from "@/components/TributeUploadForm";

export default function CreateSessionPage() {
  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Session setup</p>
        <h1>Create Session</h1>
      </section>
      <AiHealthNotice />
      <TributeUploadForm />
    </main>
  );
}
