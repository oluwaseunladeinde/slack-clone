import dynamic from "next/dynamic";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reactions";

import { Hint } from "./hint";
import { MessageToolbar } from "./message-toolbar";
import { Thumbnail } from "./thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Doc, Id } from "../../convex/_generated/dataModel";
import { useConfirm } from "@/hooks/use-confirm";
import { MessageReactions } from "./message-reactions";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }>
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    updatedAt: Doc<"messages">["updatedAt"];
    createdAt: Doc<"messages">["_creationTime"];
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;
    isEditing: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    isCompact?: boolean
    hideThreadButton?: boolean;
}

const formatFulltime = (date: Date) => {
    return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp
}: MessageProps) => {

    const avatarCallback = authorName.charAt(0).toUpperCase();

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Message",
        "Are you sure you want to delete? This cannot be undone."
    );

    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();

    const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction;

    const handleReaction = (value: string) => {
        toggleReaction({ messageId: id, value }, {
            onError: () => {
                toast.error('Failed to toggle reaction');
            }
        })
    }

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message updated successfully");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            }
        })
    }

    const handleRemove = async () => {

        const ok = await confirm();
        if (!ok) return;

        removeMessage({ id }, {
            onSuccess: () => {
                toast.success("Message deleted successfully");
                //TODO: Close thread if opened
            },
            onError: () => {
                toast.error("Failed to delete message");
            }
        });
    };

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage &&
                    "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <Hint label={formatFulltime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </Hint>
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                    variant="update"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt ? (<span className="text-xs text-muted-foreground">(edited)</span>) : null}
                                <MessageReactions data={reactions} onChange={handleReaction} />
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <MessageToolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { }}
                            handleDelete={handleRemove}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        )
    };

    return (
        <>
            <ConfirmDialog />
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage &&
                "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar className="rounded-md">
                            <AvatarImage src={authorImage} />
                            <AvatarFallback className="bg-sky-500 text-white">
                                {avatarCallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                                variant="update"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button onClick={() => { }} className="font-bold text-primary hover:underline">
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hint label={formatFulltime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body} />
                            <Thumbnail url={image} />
                            {updatedAt ? (<span className="text-xs text-muted-foreground">(edited)</span>) : null}
                            <MessageReactions data={reactions} onChange={handleReaction} />
                        </div>
                    )}
                </div>
                {!isEditing && (
                    <MessageToolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { }}
                        handleDelete={handleRemove}
                        handleReaction={handleReaction}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    )
}
