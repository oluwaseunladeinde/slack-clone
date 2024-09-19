"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ChannelHeaderProps = {
    title: string;
}

export const ChannelHeader = ({ title }: ChannelHeaderProps) => {

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete this channel?",
        "You are about to delete this channel. This action is irreversible."
    );

    const [name, setName] = useState(title);
    const [editOpen, setEditOpen] = useState(false);
    const router = useRouter();

    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();


    const { data: member } = useCurrentMember({ workspaceId });
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== "admin") return;
        setEditOpen(value);
    }

    const handleClose = () => {
        setEditOpen(false);
        setName("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '-').toLowerCase();
        setName(value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel({
            name,
            id: channelId
        }, {
            onSuccess() {
                toast.success("Updated channel successfully");
                handleClose();
            },
            onError() {
                toast.error("Failed to update channel");
            },
        })
    }

    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeChannel({
            id: channelId
        }, {
            onSuccess() {
                toast.success("Deleted channel successfully");
                handleClose();
                router.push(`/workspace/${workspaceId}`);
            },
            onError() {
                toast.error("Failed to delete channel");
            },
        })
    }

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className="text-lg font-semibold px-2 overflow-hidden w-auto"
                        size={"sm"}
                    >
                        <span className="truncate"># {title}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            # {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        {member?.role === "admin" && (
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                        )}
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        <Input
                                            value={name}
                                            disabled={isUpdatingChannel}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                            minLength={3}
                                            maxLength={80}
                                            placeholder="e.g. elite-group"
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={"outline"} disabled={isUpdatingChannel}>
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button disabled={isUpdatingChannel}>
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        {member?.role === "admin" && (
                            <button disabled={isRemovingChannel} onClick={handleRemove} className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
                                <Trash2 className="size-4 " />
                                <p className="text-sm font-semibold">Delete channel</p>
                            </button>
                        )}
                    </div>
                </DialogContent>

            </Dialog>

        </div>
    )
}
