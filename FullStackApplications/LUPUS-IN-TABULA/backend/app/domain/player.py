class Player:
    def __init__(self, id: str, name: str):
        self._id = id
        self._name = name

    def id(self) -> str:
        return self._id

    def name(self) -> str:
        return self._name