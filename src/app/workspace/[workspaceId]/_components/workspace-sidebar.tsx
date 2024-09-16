import { AlertTriangle, HashIcon, Loader2, MessageSquareText, SendHorizonal } from "lucide-react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";


export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: members } = useGetMembers({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels } = useGetChannels({ workspaceId });

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
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Threads"
                    id="threads"
                    icon={MessageSquareText}
                />
                <SidebarItem
                    label="Draft & Sent"
                    id="drafts"
                    icon={SendHorizonal}
                />
            </div>
            <WorkspaceSection label="Channels" hint="New Channel" onNew={() => { }}>
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        label={item.name}
                        icon={HashIcon}
                        id={item._id}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection label="Direct messages" hint="New direct messages" onNew={() => { }}>
                {members?.map((memberItem) => (
                    <UserItem
                        key={memberItem._id}
                        label={memberItem?.user?.name}
                        id={memberItem._id}
                        image={memberItem?.user?.image}
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
};