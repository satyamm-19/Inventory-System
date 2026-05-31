from __future__ import annotations

from time import sleep

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.core.database import engine


def wait_for_database(max_attempts: int = 30, delay_seconds: int = 2) -> None:
    last_error: Exception | None = None

    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except OperationalError as exc:
            last_error = exc
            if attempt == max_attempts:
                raise
            print(
                f"Database not ready yet, retrying {attempt}/{max_attempts} in {delay_seconds}s..."
            )
            sleep(delay_seconds)

    if last_error is not None:
        raise last_error


if __name__ == "__main__":
    wait_for_database()
    print("Database ready")