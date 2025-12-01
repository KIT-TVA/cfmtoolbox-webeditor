import string
from random import choice


def generate_random_filename(length: int, extension: str = None) -> str:
    """
    Generate a random filename from a set of known safe characters.

    Args:
        length (int): Length of the random string (excluding the extension).
        extension (str, optional): File extension to append. Defaults to None.

    Returns:
        str: Generated random filename.
    """
    random_string = "".join(choice(string.ascii_letters + string.digits) for _ in range(length))
    if extension:
        return f"{random_string}.{extension}"
    else:
        return random_string
