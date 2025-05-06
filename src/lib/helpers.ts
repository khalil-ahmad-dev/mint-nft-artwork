import type { ToastVariantType } from "@/types/artwork.types";
import { toast } from "sonner";
import ToastLookCard from "@/components/custom/shared/ToastLookCard";

export const handleShowNotificationToast = (
  variant: ToastVariantType = "error",
  title: string,
  description: string,
  duration = 3000
) => {
  toast.custom(
    (id) => {
      return ToastLookCard({
        variant,
        title,
        description,
        onClose: () => toast.dismiss(id),
      });
    },
    {
      duration,
      position: "bottom-left",
    }
  );
};
