import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="top-right"
            closeButton
            {...props}
        />
    )
}

export { Toaster }
