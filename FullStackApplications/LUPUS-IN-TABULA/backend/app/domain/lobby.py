from typing import Iterable
from app.domain.player import Player


class Lobby:
    def __init__(self, id: str, name: str):
        self._id = id
        self._name = name
        self._players: list[Player] = []

    def id(self) -> str:
        return self._id

    def name(self) -> str:
        return self._name

    def players(self) -> Iterable[Player]:
        return tuple(self._players)

    def has_player(self, player_id: str) -> bool:
        return any(p.id() == player_id for p in self._players)

    def add_player(self, player: Player) -> bool:
        if self.has_player(player.id()):
            return False
        self._players.append(player)
        return True

    def remove_player(self, player_id: str) -> bool:
        if not self.has_player(player_id):
            return False
        self._players = [p for p in self._players if p.id() != player_id]
        return True

    def is_empty(self) -> bool:
        return len(self._players) == 0
