export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface StatusConfig {
  id: UserStatus;
  label: string;
  color: string;
  icon: string;
}

export const USER_STATUSES: StatusConfig[] = [
  {
    id: 'online',
    label: 'Online',
    color: '#4CAF50',
    icon: '🟢'
  },
  {
    id: 'away',
    label: 'Away',
    color: '#FFC107',
    icon: '🟡'
  },
  {
    id: 'busy',
    label: 'Busy',
    color: '#F44336',
    icon: '🔴'
  },
  {
    id: 'offline',
    label: 'Offline',
    color: '#9E9E9E',
    icon: '⚫'
  }
];

export const DEFAULT_STATUS: UserStatus = 'offline';

export const getStatusConfig = (status: UserStatus): StatusConfig => {
  return USER_STATUSES.find(s => s.id === status) || USER_STATUSES[0];
}; 