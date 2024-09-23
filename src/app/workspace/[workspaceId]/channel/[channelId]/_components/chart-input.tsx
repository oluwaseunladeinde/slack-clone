import dynamic from "next/dynamic";
import { toast } from "sonner";
import Quill from "quill";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChartInputProps {
    placeholder: string;
}

export const ChartInput = ({ placeholder }: ChartInputProps) => {

    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);



    const editorRef = useRef<Quill | null>(null);
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
        console.log({ body, image });

        try {
            setIsPending(true);
            await createMessage({
                workspaceId,
                channelId,
                body,
            }, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="p-5 w-full">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}
