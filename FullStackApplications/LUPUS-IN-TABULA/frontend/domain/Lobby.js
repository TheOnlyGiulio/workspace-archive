import { Player } from "./Player";

export class Lobby {
  constructor({ id, name, players = [] }) {
    this._id = id;
    this._name = name;
    this._players = players.map((p) => (p instanceof Player ? p : new Player(p)));
  }

  id() {
    return this._id;
  }

  name() {
    return this._name;
  }

  players() {
    return [...this._players];
  }

  hasPlayer(playerId) {
    return this._players.some((p) => p.id() === playerId);
  }

  isEmpty() {
    return this._players.length === 0;
  }

  withPlayer(player) {
    const p = player instanceof Player ? player : new Player(player);
    if (this.hasPlayer(p.id())) return this;
    return new Lobby({
      id: this._id,
      name: this._name,
      players: [...this._players, p],
    });
  }

  withoutPlayer(playerId) {
    if (!this.hasPlayer(playerId)) return this;
    return new Lobby({
      id: this._id,
      name: this._name,
      players: this._players.filter((p) => p.id() !== playerId),
    });
  }
}
