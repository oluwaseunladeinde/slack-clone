'use client';

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export const CreateWorkspaceModal = () => {

    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("");

    const { mutate, isPending } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success("Created workspace");
                router.push(`/workspace/${id}`);
                handleClose();
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        placeholder="Workspace name e.g 'Home', 'Work', 'Personal'"
                        disabled={isPending}
                        required
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        minLength={3}
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
