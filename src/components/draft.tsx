import type { NextPage } from "next"
import { useCallback, useState } from "react"
import { Editor } from "@/components/organisms/Editor";

type DraftPageProps = {
}

const DraftPage: NextPage<DraftPageProps> = ({

}) => {
    const [value, setValue] = useState("**Hello world!!!**")

    const handleChange = useCallback((value: any) => {
        setValue(value)
    }, [])

    return (
        <div>
            <Editor
                value={value}
                onChange={handleChange}
            />
        </div>
    )
}
export default DraftPage