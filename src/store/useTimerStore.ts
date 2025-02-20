import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';


const loadTimers = (): Timer[] => {
  const storedTimers = localStorage.getItem('timers');
  return storedTimers ? JSON.parse(storedTimers) : [];
};

const saveTimers = (timers: Timer[]) => {
  localStorage.setItem('timers', JSON.stringify(timers));
};

// Initial state with persisted timers
const initialState = {
  timers: loadTimers(),
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      // state.timers.push({
      //   ...action.payload,
      //   id: crypto.randomUUID(),
      //   createdAt: Date.now(),
      // });
      const newTimer = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      saveTimers(state.timers);
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(timer => timer.id !== action.payload);
      saveTimers(state.timers);
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
        saveTimers(state.timers);
      }
    },
    updateTimer: (state) => {
      state.timers.forEach((timer) => {
        if (timer.isRunning && timer.remainingTime > 0) {
          timer.remainingTime -= 1;
          if (timer.remainingTime <= 0) {
            timer.isRunning = false; // Stop the timer when time runs out
          }
        }
      });
      saveTimers(state.timers);
    },
    
    restartTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
        saveTimers(state.timers);
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(timer => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
        saveTimers(state.timers);
      }
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};