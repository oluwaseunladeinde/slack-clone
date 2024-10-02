import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, ChevronDown, Mail, Trash, XIcon } from "lucide-react";
import { getInitialCharacters } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { DataLoading } from "@/components/data-result";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Id } from "../../../../convex/_generated/dataModel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useRemoveMember } from "@/features/members/api/use-remove-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ProfileProps {
    memberId: Id<"members">;
    onClose: () => void;
}

export const Profile = ({
    memberId,
    onClose
}: ProfileProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change role",
        "Are you sure you want to update this member's role?"
    );

    const [LeaveDialog, confirmLeave] = useConfirm(
        "Levae workspace",
        "Are you sure you want to leave this workspace?"
    );

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove member",
        "Are you sure you want to remove this member?"
    );


    const { data: currenntMember, isLoading: loadingCurrentMember } = useCurrentMember({ workspaceId });
    const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId });

    const { mutate: updateMember, isPending: updatingMember } = useUpdateMember();
    const { mutate: removeMember, isPending: removingMember } = useRemoveMember();

    const isAdminButNotCurrentUserProfile = currenntMember?.role === "admin" && currenntMember?._id !== memberId;
    const isNotAdminButCurrentUserProfile = currenntMember?._id === memberId && currenntMember?.role !== "admin";

    const onRemove = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        removeMember({ id: memberId }, {
            onSuccess() {
                toast.success("Member removed successfully");
                onClose();
            },
            onError() {
                toast.error("Failed to remove member");
            }
        });
    };

    const onLeave = async () => {
        const ok = await confirmLeave();
        if (!ok) return;

        removeMember({ id: memberId }, {
            onSuccess() {
                toast.success("You left the workspace");
                onClose();
                router.replace("/");
            },
            onError() {
                toast.error("Failed to leave the workspace");
            }
        });
    }

    const onUpdate = async (role: "admin" | "member") => {
        const ok = await confirmUpdate();
        if (!ok) return;

        updateMember({ id: memberId, role }, {
            onSuccess() {
                toast.success("Role changed");
                onClose();
            },
            onError() {
                toast.error("Failed to change role");
            }
        });
    }


    if (loadingMember || loadingCurrentMember) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex h-[49px] justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <DataLoading />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex h-[49px] justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Profile not found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <UpdateDialog />
            <LeaveDialog />
            <RemoveDialog />
            <div className="h-full flex flex-col">
                <div className="flex h-[49px] justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col p-4 items-center justify-center">
                    <Avatar className="max-w-[256px] max-h-[256px] size-full">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className="aspect-square text-6xl">
                            {getInitialCharacters(member.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col p-4">
                    <p className="text-xl font-bold">{member.user.name}</p>
                    {isAdminButNotCurrentUserProfile ? (
                        <div className="flex items-center gap-2 mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"outline"} className="w-full capitalize">
                                        {member.role}
                                        <ChevronDown className="size-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdate(role as "admin" | "member")}>
                                        <DropdownMenuRadioItem value="admin">
                                            Admin
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="member">
                                            Member
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button onClick={onRemove} className="w-full" variant={"outline"}>
                                Remove <Trash className="size-4 ml-2" />
                            </Button>
                        </div>
                    ) : isNotAdminButCurrentUserProfile ? (
                        <div className="mt-4">
                            <Button onClick={onLeave} className="w-full" variant={"outline"}>
                                Leave
                            </Button>
                        </div>
                    ) : null
                    }
                </div>
                <Separator />
                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact Information</p>
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                            <Mail className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
                            <Link href={`mailto:${member.user.email}`} className="text-sm hover:underline text-[#1264a3]">
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
