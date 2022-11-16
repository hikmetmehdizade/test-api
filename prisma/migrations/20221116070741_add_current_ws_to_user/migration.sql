/*
  Warnings:

  - The `role` column on the `assigned_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `is_done` on the `tasks` table. All the data in the column will be lost.
  - The `role` column on the `workspace_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "assigned_members" DROP COLUMN "role",
ADD COLUMN     "role" "TaskRole" NOT NULL DEFAULT 'EXECUTOR';

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "is_done";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_workspace_id" TEXT;

-- AlterTable
ALTER TABLE "workspace_members" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceMemberRole" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_workspace_id_fkey" FOREIGN KEY ("current_workspace_id") REFERENCES "workspaces"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
