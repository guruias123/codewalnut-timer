import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;

  const toastMessage = (message: string) => {
    const isMobile = window.innerWidth < 768;
    toast.error(message, {
      // duration: 50000,
      className: isMobile ? "w-full bottom-0" : "max-w-sm",
      position: isMobile ? "bottom-center" : "top-right",
      style: {
        margin: "10px 10px 0 10px"
      },
    })
  }
  
  if (!title.trim()) {
    toastMessage('Title is required')
    return false;
  }

  if (title.length > 50) {
    toastMessage('Title must be less than 50 characters');
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    toastMessage('Time values cannot be negative');
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    toastMessage('Minutes and seconds must be between 0 and 59');
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    toastMessage('Please set a time greater than 0');
    return false;
  }

  if (totalSeconds > 86400) { // 24 hours
    toastMessage('Timer cannot exceed 24 hours');
    return false;
  }

  return true;
};