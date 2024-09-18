"use client";

import { Loader, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();

    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || !workspace) return;
        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open) {
            setOpen(true);
        }
    }, [
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        router,
        workspaceId,
        open,
        setOpen
    ]);

    if (workspaceLoading || channelsLoading) {
        return (
            <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
                <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
                <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                    <Loader className="size-12 animate-spin text-muted-foreground" />
                    <p className="font-semibold text-blue-500 items-center">Please wait...</p>
                </div>
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
                <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
                <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                    <TriangleAlert className="size-12 text-muted-foreground" />
                    <span className="font-semibold text-muted-foreground items-center">Workspace not found</span>
                </div>
            </div>
        )
    }

    return null;
};


export default WorkspaceIdPage;