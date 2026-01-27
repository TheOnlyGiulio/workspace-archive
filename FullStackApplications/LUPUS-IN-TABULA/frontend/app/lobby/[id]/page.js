"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLobbyStore } from "../../../state/useLobbyStore";

function PageShell({ children }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        color: "white",
        background:
          "radial-gradient(900px 420px at 20% 10%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 420px at 80% 0%, rgba(255,255,255,0.06), transparent 55%), #0b0f17",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>{children}</div>
    </main>
  );
}

function TopBar({ lobbyName, lobbyId, onBack }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.16)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        ← Back
      </button>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{lobbyName}</div>
        <div style={{ opacity: 0.75, fontSize: 12 }}>ID: {lobbyId}</div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 12, letterSpacing: 0.2 }}>{title}</div>
      {children}
    </section>
  );
}

function PrimaryButton({ disabled, onClick, children, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: disabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.06)",
        color: "white",
        cursor: "pointer",
        fontWeight: 800,
      }}
    >
      {children}
    </button>
  );
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.16)",
        background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
        color: "white",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {children}
    </button>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.25)",
        color: "white",
        outline: "none",
      }}
    />
  );
}

function PlayersPanel({ players, loading, onRefresh }) {
  return (
    <Panel title="Inside this lobby">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ opacity: 0.85, fontSize: 13 }}>
          {loading ? "Syncing..." : `${players.length} players`}
        </div>

        <SecondaryButton onClick={onRefresh} type="button">
          Refresh
        </SecondaryButton>
      </div>

      <div style={{ marginTop: 12 }}>
        {players.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No players yet.</div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {players.map((p) => (
              <span
                key={p.id()}
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {p.name()} · {p.id()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

function JoinForm({ loading, valueId, valueName, onChangeId, onChangeName, onSubmit, onCancel }) {
  const canSubmit = valueId.trim().length > 0 && valueName.trim().length > 0 && !loading;

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10, maxWidth: 520 }}>
      <TextInput value={valueId} onChange={onChangeId} placeholder="Player ID" />
      <TextInput value={valueName} onChange={onChangeName} placeholder="Username" />
      <div style={{ display: "flex", gap: 10 }}>
        <PrimaryButton type="submit" disabled={!canSubmit}>
          Confirm Join
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </form>
  );
}

function LeaveForm({ loading, valueId, onChangeId, onSubmit, onCancel }) {
  const canSubmit = valueId.trim().length > 0 && !loading;

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10, maxWidth: 520 }}>
      <TextInput value={valueId} onChange={onChangeId} placeholder="Player ID" />
      <div style={{ display: "flex", gap: 10 }}>
        <PrimaryButton type="submit" disabled={!canSubmit}>
          Confirm Leave
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </form>
  );
}

function ActionsPanel({
  mode,
  setMode,
  loading,
  joinId,
  joinName,
  setJoinId,
  setJoinName,
  leaveId,
  setLeaveId,
  onJoin,
  onLeave,
  error,
}) {
  return (
    <Panel title="Actions">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <ToggleButton active={mode === "join"} onClick={() => setMode(mode === "join" ? null : "join")}>
          Join
        </ToggleButton>
        <ToggleButton active={mode === "leave"} onClick={() => setMode(mode === "leave" ? null : "leave")}>
          Leave
        </ToggleButton>
      </div>

      {mode === null && (
        <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>
          Choose an action. Join requires ID + username. Leave requires only ID.
        </div>
      )}

      {mode === "join" && (
        <JoinForm
          loading={loading}
          valueId={joinId}
          valueName={joinName}
          onChangeId={(e) => setJoinId(e.target.value)}
          onChangeName={(e) => setJoinName(e.target.value)}
          onSubmit={onJoin}
          onCancel={() => setMode(null)}
        />
      )}

      {mode === "leave" && (
        <LeaveForm
          loading={loading}
          valueId={leaveId}
          onChangeId={(e) => setLeaveId(e.target.value)}
          onSubmit={onLeave}
          onCancel={() => setMode(null)}
        />
      )}

      {error && (
        <div style={{ marginTop: 12, color: "rgba(255,180,180,0.95)", fontSize: 13 }}>
          {error}
        </div>
      )}
    </Panel>
  );
}

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const lobbyId = decodeURIComponent(params.id);

  const { state, actions } = useLobbyStore();

  const [mode, setMode] = useState(null);

  const [joinId, setJoinId] = useState("p1");
  const [joinName, setJoinName] = useState("Alice");

  const [leaveId, setLeaveId] = useState("p1");

  useEffect(() => {
    if (state.lobbies.length === 0) actions.load();
  }, [actions, state.lobbies.length]);

  const lobby = useMemo(
    () => state.lobbies.find((l) => l.id() === lobbyId) ?? null,
    [state.lobbies, lobbyId]
  );

  const players = lobby ? lobby.players() : [];
  const lobbyName = lobby ? lobby.name() : "Lobby";

  const handleJoin = async (e) => {
    e.preventDefault();

    const playerId = joinId.trim();
    const playerName = joinName.trim();
    if (!playerId || !playerName || state.loading) return;

    await actions.joinLobby({ lobbyId, playerId, playerName });
    setMode(null);
  };

  const handleLeave = async (e) => {
    e.preventDefault();

    const playerId = leaveId.trim();
    if (!playerId || state.loading) return;

    const result = await actions.leaveLobby({ lobbyId, playerId });
    setMode(null);

    if (result === null) router.push("/");
  };

  return (
    <PageShell>
      <TopBar lobbyName={lobbyName} lobbyId={lobbyId} onBack={() => router.push("/")} />

      <PlayersPanel players={players} loading={state.loading} onRefresh={() => actions.load()} />

      <ActionsPanel
        mode={mode}
        setMode={setMode}
        loading={state.loading}
        joinId={joinId}
        joinName={joinName}
        setJoinId={setJoinId}
        setJoinName={setJoinName}
        leaveId={leaveId}
        setLeaveId={setLeaveId}
        onJoin={handleJoin}
        onLeave={handleLeave}
        error={state.error}
      />
    </PageShell>
  );
}