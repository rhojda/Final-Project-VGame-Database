drop database if exists videogame_db;

create database videogame_db;

\c videogame_db;

CREATE TABLE "genres" (
  "id" integer,
  "name" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "consoles" (
  "id" serial,
  "name" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "id" serial,
  "name" varchar,
  "email" varchar,
  "password" varchar,
  "salt" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "user_console" (
  "id" serial,
  "user_id" integer,
  "console_id" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_user_console.id"
    FOREIGN KEY ("id")
      REFERENCES "consoles"("name"),
  CONSTRAINT "FK_user_console.id"
    FOREIGN KEY ("id")
      REFERENCES "users"("email")
);

CREATE INDEX "CCK" ON  "user_console" ("user_id", "console_id");

CREATE TABLE "games" (
  "id" serial,
  "title" varchar,
  "genre_id" integer,
  "release_date" integer,
  "developer" varchar,
  "rating" integer,
  "console_id" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_games.title"
    FOREIGN KEY ("title")
      REFERENCES "consoles"("id"),
  CONSTRAINT "FK_games.title"
    FOREIGN KEY ("title")
      REFERENCES "genres"("id")
);

CREATE INDEX "CCK" ON  "games" ("genre_id", "console_id");
