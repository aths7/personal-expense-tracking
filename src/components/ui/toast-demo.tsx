'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { customToast } from '@/lib/toast';
import { useQuickNotifications } from '@/components/ui/notification-system';

export function ToastDemo() {
  const quickNotifications = useQuickNotifications();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Toast Notifications Demo</CardTitle>
        <CardDescription>
          Test the enhanced toast notifications with close buttons and better styling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Sonner Toasts (Enhanced)</h3>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => customToast.success('Success!', {
                  description: 'This is a success message with close button'
                })}
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => customToast.error('Error occurred!', {
                  description: 'This error can be dismissed by clicking the X'
                })}
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => customToast.errorWithRetry(
                  'Failed to save data',
                  () => customToast.success('Retry successful!'),
                  { description: 'Click retry to try again' }
                )}
              >
                Error with Retry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => customToast.persistent(
                  'This stays until dismissed',
                  'info',
                  { description: 'Persistent notification example' }
                )}
              >
                Persistent Toast
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Custom Notifications</h3>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickNotifications.success(
                  'Custom Success!',
                  'This uses the custom notification system'
                )}
              >
                Custom Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickNotifications.error(
                  'Custom Error!',
                  'This has a built-in close button'
                )}
              >
                Custom Error
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickNotifications.warning(
                  'Warning!',
                  'This is a warning notification'
                )}
              >
                Custom Warning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Create multiple notifications to show "Clear All" button
                  quickNotifications.info('Notification 1', 'First notification');
                  quickNotifications.info('Notification 2', 'Second notification');
                  quickNotifications.info('Notification 3', 'Third notification shows Clear All button');
                }}
              >
                Multiple Notifications
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}