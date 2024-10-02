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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MemberHeaderProps = {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
};

export const MemberHeader = ({
    memberName = "Member",
    memberImage,
    onClick
}: MemberHeaderProps) => {

    const avatarFallback = memberName.charAt(0).toUpperCase();

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button
                variant={"ghost"}
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
                size={"sm"}
                onClick={onClick}
            >
                <Avatar className="size-6 mr-6">
                    <AvatarImage src={memberImage} />
                    <AvatarFallback>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="truncate">{memberName}</span>
                <FaChevronDown className="size-2.5 ml-2" />
            </Button>

        </div>
    )
}
