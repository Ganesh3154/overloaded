-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentStreak" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveDate" DATE,
ADD COLUMN     "longestStreak" SMALLINT NOT NULL DEFAULT 0;
