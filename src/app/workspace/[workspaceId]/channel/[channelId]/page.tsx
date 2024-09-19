"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";

import { DataLoading, DataNotFound } from "@/components/data-result";
import { ChannelHeader } from "./_components/channel-header";

const ChannelIdPage = () => {

    const channelId = useChannelId();
    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

    if (channelLoading) {
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
        </div>
    )
}

export default ChannelIdPage;
