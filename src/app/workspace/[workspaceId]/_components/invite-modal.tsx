
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
    workspaceId: Id<"workspaces">;
};


export const InviteModal = ({ open, setOpen, name, joinCode, workspaceId }: InviteModalProps) => {

    const { mutate, isPending } = useNewJoinCode();

    const handleNewCode = () => {
        mutate({ workspaceId }, {
            onSuccess() {
                toast.success('Invite Code was regenerated successfully')
            },
            onError() {
                toast.error('Invite Code was not regenerated');
            },
        })
    }

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                toast.success(`Invite link copied successfully`);
            });
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            Invite people to {name}
                        </DialogTitle>
                        <DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">{joinCode}</p>
                        <Button onClick={handleCopy} variant={"ghost"} size={"sm"}>Copy link <Copy className="size-4 ml-2" /></Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button variant={"outline"} onClick={handleNewCode} disabled={isPending}>
                            New code
                            <RefreshCcw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button>
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
