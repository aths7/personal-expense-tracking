import { useState } from 'react';
import { confirmDelete } from '@/components/ui/confirm-dialog';

interface UsePageActionsOptions {
  onDelete?: (id: string) => Promise<void>;
  deleteItemName?: string;
  deleteConsequence?: string;
}

export function usePageActions({ onDelete, deleteItemName = 'item', deleteConsequence }: UsePageActionsOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (dialogId: string) => {
    setActiveDialog(dialogId);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;

    const confirmed = confirmDelete(deleteItemName, deleteConsequence);
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await onDelete(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const withLoading = async (action: () => Promise<any>) => {
    setIsSubmitting(true);
    try {
      const result = await action();
      if (result?.success) {
        closeDialog();
      }
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    activeDialog,
    openDialog,
    closeDialog,
    handleDelete,
    withLoading,
  };
}