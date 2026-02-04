from pydantic import BaseModel


class CreateLobbyIn(BaseModel):
    lobby_id: str
    name: str


class JoinLobbyIn(BaseModel):
    pass


class LeaveLobbyIn(BaseModel):
    pass


class PlayerOut(BaseModel):
    id: str
    name: str


class LobbyOut(BaseModel):
    id: str
    name: str
    players: list[PlayerOut]
