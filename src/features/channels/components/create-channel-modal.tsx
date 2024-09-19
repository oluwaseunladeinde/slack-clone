'use client';

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export const CreateChannelModal = () => {
    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useCreateChannel();
    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState("");

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '-').toLowerCase();
        setName(value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name, workspaceId }, {
            onSuccess(id) {
                toast.success("Created channel successfully");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
                handleClose();
            },
            onError() {
                toast.error("Failed to create channel");
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        placeholder="e.g plan-budget"
                        disabled={isPending}
                        required
                        autoFocus
                        value={name}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={80}
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
