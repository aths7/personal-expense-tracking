interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog() {
  const confirm = async (options: ConfirmDialogOptions): Promise<boolean> => {
    const { title, message } = options;
    return window.confirm(`${title}\n\n${message}`);
  };

  return { confirm };
}

// Simple wrapper for the browser confirm dialog
// Can be enhanced later with a proper modal implementation
export function confirmDelete(itemName: string, consequence?: string): boolean {
  const message = consequence 
    ? `Are you sure you want to delete this ${itemName}? ${consequence}`
    : `Are you sure you want to delete this ${itemName}?`;
  
  return window.confirm(message);
}