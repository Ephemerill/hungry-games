"use client";

import { useRouter } from "next/navigation";
import { FileImage, Plus, Shield, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import type { StartSessionRequest, StartSessionResponse } from "@/types/api";

type TributeDraft = {
  id: number;
  name: string;
  district: string;
  skill: string;
};

const initialTributes: TributeDraft[] = [
  { id: 1, name: "Mara Vale", district: "District 2", skill: "Climbing" },
  { id: 2, name: "Oren Pike", district: "District 6", skill: "Tracking" }
];

export function TributeUploadForm() {
  const [tributes, setTributes] = useState<TributeDraft[]>(initialTributes);
  const [isStarting, setIsStarting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready to start through the local API bridge.");
  const router = useRouter();

  const addTribute = () => {
    setTributes((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        district: "",
        skill: ""
      }
    ]);
  };

  const updateTribute = (id: number, field: keyof TributeDraft, value: string) => {
    setTributes((current) =>
      current.map((tribute) => (tribute.id === id ? { ...tribute, [field]: value } : tribute))
    );
  };

  const startSession = async () => {
    const payload: StartSessionRequest = {
      sessionName: "Hydro Basin Draft",
      arenaId: "arena-hydro-basin",
      tributes: tributes.map(({ name, district, skill }) => ({ name, district, skill }))
    };

    setIsStarting(true);
    setStatusMessage("Starting session through the local API bridge.");

    try {
      const response = await fetch("/api/sessions/start", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Session start failed with ${response.status}`);
      }

      const data = (await response.json()) as StartSessionResponse;
      window.sessionStorage.setItem("hungry-games-session", JSON.stringify(data));
    } catch {
      window.sessionStorage.removeItem("hungry-games-session");
    } finally {
      setIsStarting(false);
      router.push("/game");
    }
  };

  return (
    <section className="setup-grid">
      <form
        className="form-panel"
        onSubmit={(event) => {
          event.preventDefault();
          void startSession();
        }}
      >
        <div className="form-header">
          <div>
            <p className="eyebrow">Tribute roster</p>
            <h2>Upload Form</h2>
          </div>
          <span className="mock-badge">Local draft</span>
        </div>

        <label className="upload-dropzone">
          <input type="file" accept="image/*,.csv" multiple />
          <Upload size={22} aria-hidden="true" />
          <span>Photo or CSV drop zone</span>
          <small>Files remain unsubmitted in this mock UI.</small>
        </label>

        <div className="tribute-editor" aria-label="Tribute drafts">
          {tributes.map((tribute, index) => (
            <fieldset className="tribute-draft" key={tribute.id}>
              <legend>
                <UserPlus size={16} aria-hidden="true" />
                Tribute {index + 1}
              </legend>
              <label>
                Name
                <input
                  value={tribute.name}
                  onChange={(event) => updateTribute(tribute.id, "name", event.target.value)}
                  placeholder="Tribute name"
                />
              </label>
              <label>
                Origin
                <input
                  value={tribute.district}
                  onChange={(event) => updateTribute(tribute.id, "district", event.target.value)}
                  placeholder="District or team"
                />
              </label>
              <label>
                Primary skill
                <input
                  value={tribute.skill}
                  onChange={(event) => updateTribute(tribute.id, "skill", event.target.value)}
                  placeholder="Skill"
                />
              </label>
            </fieldset>
          ))}
        </div>

        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={addTribute}>
            <Plus size={18} aria-hidden="true" />
            Add Tribute
          </button>
          <button className="button button-primary" type="submit" disabled={isStarting}>
            <Shield size={18} aria-hidden="true" />
            {isStarting ? "Starting" : "Start Session"}
          </button>
        </div>
      </form>

      <aside className="session-preview" aria-label="Session preview">
        <p className="eyebrow">Session card</p>
        <h2>Hydro Basin Draft</h2>
        <div className="preview-media">
          <FileImage size={34} aria-hidden="true" />
          <span>{tributes.length} roster entries</span>
        </div>
        <dl className="detail-grid compact-details">
          <div>
            <dt>Arena</dt>
            <dd>Hydro Basin</dd>
          </div>
          <div>
            <dt>Round source</dt>
            <dd>Local API bridge</dd>
          </div>
          <div>
            <dt>AI state</dt>
            <dd>{isStarting ? "Starting" : "Fallback ready"}</dd>
          </div>
        </dl>
        <p className="bridge-message">{statusMessage}</p>
      </aside>
    </section>
  );
}
