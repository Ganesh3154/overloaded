/*
  Warnings:

  - Added the required column `behavioralConfidence` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dsaLevel` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hrsPerDay` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prepTime` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemDesignLevel` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsOfExperience` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "behavioralConfidence" SMALLINT NOT NULL,
ADD COLUMN     "dsaLevel" SMALLINT NOT NULL,
ADD COLUMN     "hrsPerDay" SMALLINT NOT NULL,
ADD COLUMN     "learningStyle" TEXT[],
ADD COLUMN     "prepTime" SMALLINT NOT NULL,
ADD COLUMN     "skillsToLearn" TEXT[],
ADD COLUMN     "systemDesignLevel" SMALLINT NOT NULL,
ADD COLUMN     "techStack" TEXT[],
ADD COLUMN     "userName" VARCHAR(100) NOT NULL,
ADD COLUMN     "yearsOfExperience" SMALLINT NOT NULL;

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_target_companies" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "user_target_companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_target_companies_userId_companyId_key" ON "user_target_companies"("userId", "companyId");

-- AddForeignKey
ALTER TABLE "user_target_companies" ADD CONSTRAINT "user_target_companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_target_companies" ADD CONSTRAINT "user_target_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
