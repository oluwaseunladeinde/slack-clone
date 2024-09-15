import { useRouter } from "next/navigation";

import { Loader2, Plus } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal();

    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId
    );

    console.log({ _open, workspacesLoading });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl"
                >
                    {workspaceLoading ? (
                        <Loader2 className="size-5 animate-spin shrink-0" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem onClick={() => router.push(`/workspace/${workspaceId}`)} className="cursor-pointer flex-col justify-start items-start capitalize">
                    {workspace?.name}
                    <span className="text-xs text-[#481349]">
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {filteredWorkspaces?.map((workspace, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="cursor-pointer capitalize overflow-hidden"
                        onClick={() => router.push(`/workspace/${workspace._id}`)}
                    >
                        <div className="flex items-center justify-center mr-2 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md ">
                            {workspace?.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">{workspace?.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                    <div className="flex items-center justify-center mr-2 size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md ">
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};