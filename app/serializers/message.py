from pydantic import BaseModel, Field


class Message(BaseModel):
    message: str


class MessageContent(BaseModel):
    type: str = Field(
        None, description="Type of the message, can be 'text' or 'sticker'."
    )
    id: str = Field(None, description="Unique identifier for the message.")
    text: str | None = Field(
        None, description="Text content of the message, present only for text messages."
    )
    quoteToken: str | None = Field(
        None, description="Token for quoting the message, optional field."
    )
    stickerId: str | None = Field(
        None,
        description="Identifier for the sticker, present only for sticker messages.",
    )
    packageId: str | None = Field(
        None,
        description="Identifier for the sticker package, present only for sticker messages.",
    )
    stickerResourceType: str | None = Field(
        None,
        description="Type of sticker resource (e.g., 'ANIMATION'), present only for sticker messages.",
    )
    keywords: list[str] | None = Field(
        None,
        description="List of keywords associated with the sticker, present only for sticker messages.",
    )


class Source(BaseModel):
    type: str
    groupId: str | None = Field(
        None, description="Group ID will be present if it's from a group"
    )
    userId: str


class Event(BaseModel):
    type: str
    message: MessageContent
    webhookEventId: str
    deliveryContext: dict[str, bool]
    timestamp: int
    source: Source
    replyToken: str
    mode: str


class WebhookPayLoad(BaseModel):
    destination: str
    events: list[Event]
