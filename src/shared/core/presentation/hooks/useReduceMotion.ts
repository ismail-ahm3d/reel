import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Whether the user asked the system to reduce motion; follows the setting while the app runs. */
export const useReduceMotion = (): boolean => {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduceMotion;
};
