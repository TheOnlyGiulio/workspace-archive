import { Lobby } from "../domain/Lobby";

const DEFAULT_BASE_URL = "http://127.0.0.1:8000";

export class LobbyApi {
  constructor({ baseUrl = DEFAULT_BASE_URL, getToken = () => null } = {}) {
    this._baseUrl = baseUrl.replace(/\/+$/, "");
    this._getToken = getToken;
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

  async joinLobby({ lobbyId }) {
    const data = await this._requestJson(`/lobbies/${encodeURIComponent(lobbyId)}/join`, {
      method: "POST",
      body: {},
    });
    return new Lobby(data);
  }

  async leaveLobby({ lobbyId }) {
    try {
      const data = await this._requestJson(`/lobbies/${encodeURIComponent(lobbyId)}/leave`, {
        method: "POST",
        body: {},
      });
      return new Lobby(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("HTTP 404")) return null;
      throw e;
    }
  }

  async _requestJson(path, { method = "GET", body = null } = {}) {
    const headers = {};

    const token = this._getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    if (body !== null) headers["Content-Type"] = "application/json";

    const res = await fetch(`${this._baseUrl}${path}`, {
      method,
      headers,
      body: body === null ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`.trim());
    }

    if (res.status === 204) return null;
    return res.json();
  }
}