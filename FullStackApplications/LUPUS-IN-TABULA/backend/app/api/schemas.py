from pydantic import BaseModel


class CreateLobbyIn(BaseModel):
    lobby_id: str
    name: str


class JoinLobbyIn(BaseModel):
    player_id: str
    player_name: str


class LeaveLobbyIn(BaseModel):
    player_id: str


class PlayerOut(BaseModel):
    id: str
    name: str


class LobbyOut(BaseModel):
    id: str
    name: str
    players: list[PlayerOut]
