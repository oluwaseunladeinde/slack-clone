import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
    parentMessageId?: Id<"messages">,
    channelId?: Id<"channels">,
    conversationId?: Id<"conversations">,
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({ parentMessageId, channelId, conversationId }: UseGetMessagesProps) => {
    const { results, status, loadMore } = usePaginatedQuery(
        api.messages.get,
        { channelId, parentMessageId, conversationId },
        { initialNumItems: BATCH_SIZE }
    );

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE)
    };
}