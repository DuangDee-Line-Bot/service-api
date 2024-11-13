import json
import logging

from app.utils import reply_msg

logger = logging.getLogger(__name__)

file_path = "db/data.json"


def get_db():
    """Read Json Files."""
    try:
        with open(file_path, encoding="utf-8") as file:
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


def find_data(bot_api: str, reply_token: str, msg: str) -> bool:
    data = get_db()
    matched_item = next((x for x in data if x["key"] == msg), None)
    if matched_item:
        # Format the response
        msg = (
            f"{matched_item['Aspect']}\n\n"
            f"{matched_item['TH']}\n\n"
            f"{matched_item['CH']}\n\n"
            f"{matched_item['ENG']}"
        )
        reply_msg(bot_api=bot_api, reply_token=reply_token, msg=msg)
        return True
    else:
        msg = "ไม่พบข้อมูลที่ตรงกัน"
        reply_msg(bot_api=bot_api, reply_token=reply_token, msg=msg)
        return False
