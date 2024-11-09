import json
import logging

logger = logging.getLogger(__name__)

file_path = "db/data.json"

def get_db():
    """Read Json Files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        msg = f"Error: The file {file_path} was not found."
        logger.exception(msg)
        return None
    except json.JSONDecodeError:
        msg = f"Error: The file {file_path} is not a valid JSON file."
        logger.exception(msg)
        return None