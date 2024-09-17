"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import VerificationInput from "react-verification-input";

import { Id } from "../../../../convex/_generated/dataModel";
import { useJoin } from "@/features/workspaces/api/use-join";
import { toast } from "sonner";
import { cn } from "@/lib/utils";



interface WorkspaceJoinPageProps {
    params: {
        workspaceId: Id<"workspaces">;
    }
};

const WorkspaceJoinPage = ({ params }: WorkspaceJoinPageProps) => {

    const workspaceId = params.workspaceId;

    const router = useRouter();
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

    const { mutate, isPending } = useJoin();

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId])

    const handleComplete = (value: string) => {
        mutate({
            workspaceId: params.workspaceId,
            joinCode: value,
        }, {
            onSuccess() {
                toast.success("Workspace joined");
                router.replace(`/workspace/${params.workspaceId}`);
            },
            onError() {
                toast.error("Wrong join code. Please try again.");
            },
        });
    }

    if (isLoading) {
        return (
            <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
                <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
                <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                    <Loader className="size-12 animate-spin text-muted-foreground" />
                    <p className="font-semibold text-blue-500 items-center">Please wait...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
            <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-gray-800",
                        characterFilled: "bg-white text-black"
                    }}
                    autoFocus
                />
            </div>
            <div className="flex gap-x-4">
                <Button asChild variant={"outline"} size={"lg"}>
                    <Link href="/">
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default WorkspaceJoinPage;