export type TimeFormat = 'HH:mm:ss' | 'mm:ss' | 'seconds';

export const formatTime = (seconds: number, format: TimeFormat = 'HH:mm:ss'): string => {
  const pad = (num: number): string => num.toString().padStart(2, '0');
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  switch (format) {
    case 'seconds':
      return seconds.toString();
    case 'mm:ss':
      return `${pad(minutes)}:${pad(secs)}`;
    case 'HH:mm:ss':
    default:
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
};

export const parseTime = (timeString: string): number => {
  // Handle seconds format
  if (!timeString.includes(':')) {
    return parseInt(timeString, 10);
  }

  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  // Handle mm:ss format
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  
  // Handle HH:mm:ss format
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  throw new Error('Invalid time format. Use HH:mm:ss, mm:ss, or seconds');
};

export const getTimeFormatLabel = (format: TimeFormat): string => {
  switch (format) {
    case 'HH:mm:ss':
      return 'Hours:Minutes:Seconds';
    case 'mm:ss':
      return 'Minutes:Seconds';
    case 'seconds':
      return 'Seconds';
    default:
      return format;
  }
};

export const TIME_FORMATS: TimeFormat[] = ['HH:mm:ss', 'mm:ss', 'seconds'];

export const timestampFormatOptions = [
  {
    value: 'HH:mm:ss',
    label: 'Hours:Minutes:Seconds',
    example: '01:23:45'
  },
  {
    value: 'mm:ss',
    label: 'Minutes:Seconds',
    example: '23:45'
  },
  {
    value: 'seconds',
    label: 'Seconds',
    example: '5025'
  }
] as const; 