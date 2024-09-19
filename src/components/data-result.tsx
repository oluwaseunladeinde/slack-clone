import { Loader2, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface DataResultProps {
    message?: string;
}

export const DataNotFound = ({ message }: DataResultProps) => {
    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
            <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <TriangleAlert className="size-12 text-muted-foreground" />
                <span className="font-semibold text-muted-foreground items-center">{message || "Data not found"}</span>
            </div>
        </div>
    )
}

interface DataLoadingProps {
    message?: string;
}
export const DataLoading = ({ message }: DataLoadingProps) => {
    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md ">
            <Image src={"/hash-2.svg"} alt="logo" width={100} height={60} />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <Loader2 className="size-12 animate-spin text-muted-foreground" />
                <span className="font-semibold text-muted-foreground items-center">{message}</span>
            </div>
        </div>
    )
}
