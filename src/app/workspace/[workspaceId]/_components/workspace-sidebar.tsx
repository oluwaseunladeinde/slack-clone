import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader2 } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";


export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

    if (memberLoading || workspaceLoading) {
        return (
            <div className="flex flex-col h-full bg=[#5E2C5F] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-white" />
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className="flex flex-col h-full gap-y-2 bg=[#5E2C5F] items-center justify-center">
                <AlertTriangle className="size-5 text-white" />
                <p className="text-white text-sm">Workspace not found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg=[#5E2C5F]">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
        </div>
    )
};