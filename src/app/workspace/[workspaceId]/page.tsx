"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DataLoading, DataNotFound } from "@/components/data-result";

const WorkspaceIdPage = () => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);


    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !workspace || !member) return;
        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        member,
        memberLoading,
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        router,
        workspaceId,
        open,
        setOpen,
        isAdmin
    ]);

    if (workspaceLoading || channelsLoading || memberLoading) {
        return (
            <DataLoading message="Please wait..." />
        )
    }

    if (!workspace || !member) {
        return (
            <DataNotFound message="Workspace not found" />
        )
    }

    return (
        <DataNotFound message="No channel found" />
    )
};


export default WorkspaceIdPage;