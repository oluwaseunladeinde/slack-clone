"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseCurrentUser } from "../hooks/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { getInitialCharacters } from "@/lib/utils";



export const UserButton = () => {
    const { signOut } = useAuthActions();
    const { data, isLoading } = UseCurrentUser();

    if (isLoading) {
        return (
            <Loader className="size-4 animate-spin text-muted-foreground" />
        )
    }

    if (!data) {
        return null;
    }

    const { name, image } = data;
    //const avatarFallback = name!.charAt(0).toUpperCase();
    const avatarFallback = getInitialCharacters(name);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition cursor-pointer">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={() => signOut()} className="h-10">
                    <LogOut className="size-8 mr-2" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};