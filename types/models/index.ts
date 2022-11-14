import {
  Task as BaseTask,
  User as BaseUser,
  Workspace as BaseWorkspace,
  WorkspaceMember as BaseWorkspaceMember,
  WorkspaceTaskStatus as BaseWorkspaceTaskStatus,
  AssignedMember as BaseAssignedMember
} from '../../prisma/generated';

export interface User extends BaseUser {
  workspaceParticipation: WorkspaceMember[];
}

export interface WorkspaceMember extends BaseWorkspaceMember {
  workspace: Workspace;
}

export interface Workspace extends BaseWorkspace {
  tasks: Task;
}

export interface Task extends BaseTask {
  workspace: Workspace;
  status: WorkspaceTaskStatus;
}

export interface WorkspaceTaskStatus extends BaseWorkspaceTaskStatus {
    workspace: Workspace;
    tasks: Task[]
}

export interface AssignedMember extends BaseAssignedMember {

}
