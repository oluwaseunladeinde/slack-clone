import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { DataLoading } from "@/components/data-result";
import { MemberHeader } from "./member-header";
import { MemberChartInput } from "./memeber-chart-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
    id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMemberId();

    const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
    const { results, status, loadMore } = useGetMessages({
        conversationId: id
    });

    if (memberLoading || status === "LoadingFirstPage") {
        return (
            <DataLoading />
        )
    }

    return (
        <div className="flex flex-col h-full">
            <MemberHeader
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => { }}
            />
            <MessageList
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <MemberChartInput
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    )
}
