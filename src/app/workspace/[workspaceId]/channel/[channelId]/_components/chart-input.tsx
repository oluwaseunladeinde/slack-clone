import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChartInputProps {
    placeholder: string;
}

export const ChartInput = ({ placeholder }: ChartInputProps) => {

    const editorRef = useRef<Quill | null>(null)

    return (
        <div className="p-5 w-full">
            <Editor
                placeholder={placeholder}
                onSubmit={() => { }}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    )
}
