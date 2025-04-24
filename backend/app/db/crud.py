from typing import Any

from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.permission import Permission

from appwrite.services.users import Users
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
from appwrite.query import Query

from pydantic import BaseModel, ConfigDict


class CRUD(BaseModel):
    """Handles create, read, update, and delete operations for a database collection."""

    db: Databases
    db_id: str
    collection_id: str

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def create_one(
        self,
        data: dict,
        permissions: list[Permission] | None = None,
    ) -> dict[str, Any]:
        """Adds an item to the collection."""
        return self.db.create_document(
            database_id=self.db_id,
            collection_id=self.collection_id,
            document_id=ID.unique(),
            data=data,
            permissions=permissions,
        )

    def get_one(self, id: str) -> dict[str, Any]:
        """Retrieves a single item from the collection."""
        return self.db.get_document(
            database_id=self.db_id,
            collection_id=self.collection_id,
            document_id=id,
        )

    def get_multiple(self, queries: list[Query] | None = None) -> dict[str, Any]:
        """Retrieves multiple items from a collection."""
        return self.db.list_documents(
            database_id=self.db_id,
            collection_id=self.collection_id,
            queries=queries,
        )

    def update_one(
        self,
        id: str,
        data: dict,
        permissions: list[Permission] | None = None,
    ) -> dict[str, Any]:
        """Updates an item in the collection."""
        return self.db.update_document(
            database_id=self.db_id,
            collection_id=self.collection_id,
            document_id=id,
            data=data,
            permissions=permissions,
        )

    def delete_one(self, id: str) -> dict[str, Any]:
        """Deletes an item from the collection."""
        return self.db.delete_document(
            database_id=self.db_id,
            collection_id=self.collection_id,
            document_id=id,
        )


class UserCRUD(BaseModel):
    """Handles create, read, update, and delete operations for the user database."""

    db: Users

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def get_one(self, id: str) -> dict[str, Any]:
        """Retrieves a single user."""
        return self.db.get(id)

    def create_one(self, data: dict) -> dict[str, Any]:
        """Creates a single user."""
        return self.db.create(
            user_id=ID.unique(),
            password=None,
            **data,
        )


class StorageCRUD(BaseModel):
    """Handles create, read, update, and delete operations for the user database."""

    db: Storage
    bucket_id: str

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def create_one(
        self,
        file: InputFile,
        permissions: list[Permission] | None = None,
    ) -> dict[str, Any]:
        """Adds a file to the storage bucket."""
        return self.db.create_file(
            bucket_id=self.bucket_id,
            file_id=ID.unique(),
            file=file,
            permissions=permissions,
        )

    def get_one(self, id: str) -> dict[str, Any]:
        """Retrieves a single file from the storage bucket."""
        return self.db.get_file(
            bucket_id=self.bucket_id,
            file_id=id,
        )

    def update_one(
        self,
        id: str,
        name: str | None = None,
        permissions: list[Permission] | None = None,
    ) -> dict[str, Any]:
        """Updates a single file in the storage bucket."""
        return self.db.update_file(
            bucket_id=self.bucket_id,
            file_id=id,
            name=name,
            permissions=permissions,
        )
