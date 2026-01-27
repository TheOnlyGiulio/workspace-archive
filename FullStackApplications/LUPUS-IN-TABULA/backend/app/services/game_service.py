from app.domain.lobby import Lobby
from app.domain.player import Player
from app.ports.lobby_repository_port import LobbyRepositoryPort
from app.ports.game_service_port import GameServicePort


class GameService(GameServicePort):
    def __init__(self, lobby_repo: LobbyRepositoryPort):
        self._lobby_repo = lobby_repo

    def list_lobbies(self) -> tuple[Lobby, ...]:
        return self._lobby_repo.all()

    def create_lobby(self, lobby_id: str, name: str) -> Lobby:
        lobby = Lobby(lobby_id, name)
        self._lobby_repo.add(lobby)
        return lobby

    def join_lobby(self, lobby_id: str, player_id: str, player_name: str) -> Lobby | None:
        lobby = self._lobby_repo.get(lobby_id)
        if lobby is None:
            return None
        lobby.add_player(Player(player_id, player_name))
        return lobby

    def leave_lobby(self, lobby_id: str, player_id: str) -> Lobby | None:
        lobby = self._lobby_repo.get(lobby_id)
        if lobby is None:
            return None
        lobby.remove_player(player_id)
        if lobby.is_empty():
            self._lobby_repo.remove(lobby.id())
            return None
        return lobby
