-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WeekStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskTag" AS ENUM ('DSA', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'NEW_SKILL', 'RESUME');

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalWeeks" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_weeks" (
    "id" SERIAL NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "weekNumber" SMALLINT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "status" "WeekStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "roadmap_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_tasks" (
    "id" SERIAL NOT NULL,
    "roadmapWeekId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "tag" "TaskTag" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "duration" VARCHAR(20) NOT NULL,
    "xp" SMALLINT NOT NULL,

    CONSTRAINT "roadmap_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_weeks" ADD CONSTRAINT "roadmap_weeks_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_tasks" ADD CONSTRAINT "roadmap_tasks_roadmapWeekId_fkey" FOREIGN KEY ("roadmapWeekId") REFERENCES "roadmap_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
