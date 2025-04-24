'use client';

import { AlarmProvider } from '../contexts/AlarmContext';
import AlarmNotificationModal from './AlarmNotificationModal';
import { useAlarm } from '../contexts/AlarmContext';

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { activeAlarm, stopAlarm, snoozeAlarm } = useAlarm();

  return (
    <>
      {children}
      <AlarmNotificationModal
        isOpen={activeAlarm !== null}
        onClose={stopAlarm}
        onSnooze={snoozeAlarm}
        alarmTime={activeAlarm?.time || ''}
      />
    </>
  );
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlarmProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AlarmProvider>
  );
};

export default ClientLayout; 