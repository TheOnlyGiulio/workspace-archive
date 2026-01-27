from fastapi import APIRouter, Depends, HTTPException
from app.api.schemas import CreateLobbyIn, JoinLobbyIn, LeaveLobbyIn, LobbyOut, PlayerOut


def _lobby_to_out(lobby) -> LobbyOut:
    return LobbyOut(
        id=lobby.id(),
        name=lobby.name(),
        players=[PlayerOut(id=p.id(), name=p.name()) for p in lobby.players()],
    )


def build_lobby_router(get_game_service):
    router = APIRouter(prefix="/lobbies", tags=["lobbies"])

    @router.get("/", response_model=list[LobbyOut])
    def list_lobbies(game=Depends(get_game_service)):
        return [_lobby_to_out(l) for l in game.list_lobbies()]

    @router.post("/", response_model=LobbyOut)
    def create_lobby(payload: CreateLobbyIn, game=Depends(get_game_service)):
        lobby = game.create_lobby(payload.lobby_id, payload.name)
        return _lobby_to_out(lobby)

    @router.post("/{lobby_id}/join", response_model=LobbyOut)
    def join_lobby(lobby_id: str, payload: JoinLobbyIn, game=Depends(get_game_service)):
        lobby = game.join_lobby(lobby_id, payload.player_id, payload.player_name)
        if lobby is None:
            raise HTTPException(status_code=404, detail="Lobby not found")
        return _lobby_to_out(lobby)

    @router.post("/{lobby_id}/leave", response_model=LobbyOut)
    def leave_lobby(lobby_id: str, payload: LeaveLobbyIn, game=Depends(get_game_service)):
        lobby = game.leave_lobby(lobby_id, payload.player_id)
        if lobby is None:
            raise HTTPException(status_code=404, detail="Lobby not found")
        return _lobby_to_out(lobby)

    return router