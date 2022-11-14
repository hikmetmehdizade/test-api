/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `users_identity` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worksapce_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkspaceMemberRole" AS ENUM ('OWNER', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TaskRole" AS ENUM ('CREATOR', 'OBSERVER', 'EXECUTOR');

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_id_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "created_by_id",
ADD COLUMN     "status_id" TEXT NOT NULL,
ADD COLUMN     "worksapce_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_identity" DROP COLUMN "refreshToken",
ADD COLUMN     "refresh_token" TEXT;

-- CreateTable
CREATE TABLE "workspaces" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "role" "WorkspaceMemberRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "assigned_members" (
    "member_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "role" "TaskRole" NOT NULL DEFAULT 'EXECUTOR',

    CONSTRAINT "assigned_members_pkey" PRIMARY KEY ("member_id","task_id")
);

-- CreateTable
CREATE TABLE "workspace_task_statuses" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "workspace_task_statuses_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_worksapce_id_fkey" FOREIGN KEY ("worksapce_id") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "workspace_task_statuses"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_members" ADD CONSTRAINT "assigned_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "workspace_members"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_members" ADD CONSTRAINT "assigned_members_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_task_statuses" ADD CONSTRAINT "workspace_task_statuses_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
