import Link from "next/link";
import { cn, getInitialCharacters } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Id } from "../../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc] hover:text-white",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)


interface UserItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({ id, image, label = "Member", variant }: UserItemProps) => {
    const workspaceId = useWorkspaceId();
    const avatarFallback = getInitialCharacters(label);
    return (
        <Button
            variant={"transparent"}
            className={cn(userItemVariants({ variant }))}
            size={"sm"}
            asChild
        >
            <Link href={`/workspace/${workspaceId}/members/${id}`}>
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage className="rounded-md" src={image} />
                    <AvatarFallback className="rounded-md" >
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}
