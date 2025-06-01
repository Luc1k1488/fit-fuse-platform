
import { useState } from "react";

interface UseConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<UseConfirmDialogProps>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (props: UseConfirmDialogProps): Promise<boolean> => {
    setConfig(props);
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      resolver?.(true);
    } finally {
      setLoading(false);
      setIsOpen(false);
      setResolver(null);
    }
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
    setResolver(null);
  };

  return {
    isOpen,
    loading,
    config,
    confirm,
    handleConfirm,
    handleCancel,
    setIsOpen,
  };
};
