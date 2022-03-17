CREATE TABLE IF NOT EXISTS "articles"(
    "id" INTEGER PRIMARY KEY NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITH TIME zone NOT NULL,
    "updated_at" TIMESTAMP(0) WITH TIME zone NOT NULL
);