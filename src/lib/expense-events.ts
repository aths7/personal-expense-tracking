// Simple event emitter for expense-related events
type ExpenseEventType = 'EXPENSE_ADDED' | 'EXPENSE_UPDATED' | 'EXPENSE_DELETED';

type ExpenseEventListener = (data?: any) => void;

class ExpenseEventEmitter {
  private listeners: Map<ExpenseEventType, ExpenseEventListener[]> = new Map();

  // Subscribe to expense events
  on(event: ExpenseEventType, listener: ExpenseEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  // Emit expense events
  emit(event: ExpenseEventType, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  // Remove all listeners for cleanup
  removeAllListeners() {
    this.listeners.clear();
  }
}

// Export singleton instance
export const expenseEvents = new ExpenseEventEmitter();