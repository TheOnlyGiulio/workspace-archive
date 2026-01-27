from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.repositories.lobby_repositories import LobbyRepository
from app.services.game_service import GameService
from app.routes.lobby_routes import build_lobby_router


def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    lobby_repo = LobbyRepository()
    game_service = GameService(lobby_repo)

    def get_game_service():
        return game_service

    app.include_router(build_lobby_router(get_game_service))
    return app


app = create_app()