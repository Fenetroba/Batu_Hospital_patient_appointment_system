import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetPassword } from '../../Stores/UserSlice'
import { toast } from 'react-toastify'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ResetPassword = ({ userId }) => {
    const dispatch = useDispatch()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const ResetPasswordHandler = async () => {
        if (!userId) {
            toast.error("User ID is missing");
            return;
        }

        setIsLoading(true);
        try {
            const resultAction = await dispatch(resetPassword(userId));
            if (resetPassword.fulfilled.match(resultAction)) {
                toast.success("Password reset successfully");
                setIsDialogOpen(false);
            } else {
                if (resultAction.payload) {
                    toast.error(resultAction.payload.message);
                } else {
                    toast.error(resultAction.error.message || "Failed to reset password");
                }
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
            console.error("Failed to reset password: ", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                className="p-1 text-blue-500 hover:text-blue-700"
                onClick={() => setIsDialogOpen(true)}
                title="Reset Password"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
            </button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Password Reset</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reset the password for this user?
                            The password will be reset to the default: <strong>Ba@12345</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={ResetPasswordHandler} disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Confirm Reset"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ResetPassword