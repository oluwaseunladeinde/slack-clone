"use client";

import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";

import { DataLoading, DataNotFound } from "@/components/data-result";
import { MessageList } from "@/components/message-list";

import { ChannelHeader } from "./_components/channel-header";
import { ChartInput } from "./_components/chart-input";



const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });
    const { results, status, loadMore } = useGetMessages({ channelId });


    if (channelLoading || status === "LoadingFirstPage") {
        return (
            <DataLoading message="Please wait..." />
        )
    }

    if (!channel) {
        return (
            <DataNotFound message="Channel not found" />
        )
    }

    return (
        <div className="flex flex-col h-full">
            <ChannelHeader title={channel.name} />
            <MessageList
                channelName={channel.name}
                channleCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChartInput placeholder={`Message # ${channel.name}`} />
        </div>
    )
}

export default ChannelIdPage;
