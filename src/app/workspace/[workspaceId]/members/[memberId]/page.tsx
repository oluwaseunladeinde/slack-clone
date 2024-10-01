"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { DataLoading, DataNotFound } from "@/components/data-result";
import { Conversation } from "./_components/conversations";

const MemberIdPage = () => {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const [conversationId, setConverstionId] = useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate({
            memberId,
            workspaceId
        }, {
            onSuccess(data) {
                setConverstionId(data);
                toast.success("Conversation found");
            },
            onError() {
                console.log("Failed to get or create conversation");
            }
        })
    }, [mutate, memberId, workspaceId]);

    if (isPending) {
        return (
            <DataLoading />
        );
    }

    if (!conversationId) {
        return (
            <DataNotFound message="Conversation not found" />
        );
    }

    return (
        <Conversation id={conversationId} />
    )
}

export default MemberIdPage