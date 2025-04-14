// src/components/auth/ApprovalDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

import { toast } from "sonner";
interface ApprovalDialogProps {
  onSubmit: () => void;
}

export function ApprovalDialog({ onSubmit }: ApprovalDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    setSubmitted(true);
    toast.success("Sent for Approval ✅");
    onSubmit(); // parent can close drawer or send data
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]">Send for Approval</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center">
        {!submitted ? (
          <>
            <DialogHeader className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <DialogTitle>Confirmation</DialogTitle>
              <DialogDescription>
                Please check all the details before submitting for approval.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-[var(--btn-back-bg)] text-[var(--btn-back-text)] border border-[var(--btn-back-border)] hover:bg-[var(--btn-back-hover-bg)]"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="bg-[var(--primary)]">
                Submit
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8">
            <h2 className="text-lg font-semibold text-[var(--primary)] mb-2">
              Sent for Approval
            </h2>
            <p className="text-sm text-gray-600">Details are sent for approval</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
