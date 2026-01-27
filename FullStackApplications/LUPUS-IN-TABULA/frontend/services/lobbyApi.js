import { Lobby } from "../domain/Lobby";

const DEFAULT_BASE_URL = "http://127.0.0.1:8000";

export class LobbyApi {
  constructor({ baseUrl = DEFAULT_BASE_URL } = {}) {
    this._baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async listLobbies() {
    const data = await this._requestJson("/lobbies/");
    return data.map((x) => new Lobby(x));
  }

  async createLobby({ lobbyId, name }) {
    const data = await this._requestJson("/lobbies/", {
      method: "POST",
      body: { lobby_id: lobbyId, name },
    });
    return new Lobby(data);
  }

  async joinLobby({ lobbyId, playerId, playerName }) {
    const data = await this._requestJson(`/lobbies/${encodeURIComponent(lobbyId)}/join`, {
      method: "POST",
      body: { player_id: playerId, player_name: playerName },
    });
    return new Lobby(data);
  }

  async leaveLobby({ lobbyId, playerId }) {
    try {
      const data = await this._requestJson(`/lobbies/${encodeURIComponent(lobbyId)}/leave`, {
        method: "POST",
        body: { player_id: playerId },
      });
      return new Lobby(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("HTTP 404")) return null;
      throw e;
    }
  }


  async _requestJson(path, { method = "GET", body } = {}) {
    const res = await fetch(`${this._baseUrl}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`.trim());
    }

    return res.json();
  }
}