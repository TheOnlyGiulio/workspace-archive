import { LobbyApi } from "../services/lobbyApi";

class LobbyStore {
  constructor({ api } = {}) {
    this._api = api ?? new LobbyApi();
    this._state = {
      lobbies: [],
      loading: false,
      error: null,
    };
    this._listeners = new Set();
  }

  getState() {
    return this._state;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _setState(patch) {
    this._state = { ...this._state, ...patch };
    for (const l of this._listeners) l();
  }

  async load() {
    this._setState({ loading: true, error: null });
    try {
      const lobbies = await this._api.listLobbies();
      this._setState({ lobbies, loading: false });
    } catch (e) {
      this._setState({ error: e instanceof Error ? e.message : String(e), loading: false });
    }
  }

  async createLobby({ lobbyId, name }) {
    this._setState({ loading: true, error: null });
    try {
      const lobby = await this._api.createLobby({ lobbyId, name });
      const lobbies = [...this._state.lobbies, lobby];
      this._setState({ lobbies, loading: false });
      return lobby;
    } catch (e) {
      this._setState({ error: e instanceof Error ? e.message : String(e), loading: false });
      return null;
    }
  }

  async joinLobby({ lobbyId, playerId, playerName }) {
    this._setState({ loading: true, error: null });
    try {
      const updated = await this._api.joinLobby({ lobbyId, playerId, playerName });
      const lobbies = this._state.lobbies.map((l) => (l.id() === lobbyId ? updated : l));
      this._setState({ lobbies, loading: false });
      return updated;
    } catch (e) {
      this._setState({ error: e instanceof Error ? e.message : String(e), loading: false });
      return null;
    }
  }

  async leaveLobby({ lobbyId, playerId }) {
    this._setState({ loading: true, error: null });
    try {
      const updated = await this._api.leaveLobby({ lobbyId, playerId });

      if (updated === null) {
        const lobbies = this._state.lobbies.filter((l) => l.id() !== lobbyId);
        this._setState({ lobbies, loading: false, error: null });
        return null;
      }

      const lobbies = this._state.lobbies.map((l) => (l.id() === lobbyId ? updated : l));
      this._setState({ lobbies, loading: false });
      return updated;
    } catch (e) {
      this._setState({ error: e instanceof Error ? e.message : String(e), loading: false });
      return null;
    }
  }

}

export const lobbyStore = new LobbyStore();