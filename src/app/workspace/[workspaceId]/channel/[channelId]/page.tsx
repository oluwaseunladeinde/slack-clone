"use client";

import { UseGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";

import { DataLoading, DataNotFound } from "@/components/data-result";
import { ChannelHeader } from "./_components/channel-header";
import { ChartInput } from "./_components/chart-input";


const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });
    const { results } = UseGetMessages({ channelId });



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
            <div className="flex-1">
                {JSON.stringify(results)}
            </div>
            <ChartInput placeholder={`Message # ${channel.name}`} />
        </div>
    )
}

export default ChannelIdPage;
