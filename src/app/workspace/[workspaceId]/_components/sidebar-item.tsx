import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc] hover:text-white",
                active: "bg-white/25 text-white hover:bg-white/90 hover:text-[#481349]",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)


interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({ label, icon: Icon, id, variant }: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <Button
            asChild
            variant={"transparent"}
            size={"sm"}
            className={cn(sidebarItemVariants({ variant }))}
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className="size-3.5 mr-1 shrink-0" />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}
