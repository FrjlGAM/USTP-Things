import { useState, useEffect, useCallback, useRef } from 'react';

type StorageOptions<T> = {
  /**
   * The key under which the value will be stored in localStorage
   */
  key: string;
  
  /**
   * The initial value to use if there is no value in localStorage
   */
  initialValue?: T;
  
  /**
   * If true, the value will be stored as JSON (default: true)
   */
  serialize?: boolean;
  
  /**
   * Optional expiration time in milliseconds
   */
  expiresIn?: number;
  
  /**
   * If true, the value will be synced across browser tabs (default: false)
   */
  syncAcrossTabs?: boolean;
};

/**
 * A hook to manage localStorage with React state
 * 
 * @template T - The type of the stored value
 * @param {StorageOptions<T>} options - Configuration options
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} - The stored value, a function to update it, and a function to remove it
 */
export function useLocalStorage<T>(
  options: StorageOptions<T>
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const {
    key,
    initialValue,
    serialize = true,
    expiresIn,
    syncAcrossTabs = false,
  } = options;

  // Get initial value from localStorage if it exists
  const getStoredValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (!item) return initialValue as T;
      
      const parsed = serialize ? JSON.parse(item) : item;
      
      // Check if the item has expired
      if (expiresIn && parsed?.expiresAt && new Date().getTime() > parsed.expiresAt) {
        window.localStorage.removeItem(key);
        return initialValue as T;
      }
      
      return parsed.value ?? parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue as T;
    }
  }, [key, initialValue, serialize, expiresIn]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);
  const isInitialMount = useRef(true);

  // Update the stored value in localStorage when it changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Update the state
        setStoredValue(valueToStore);
        
        // Prepare the value to be stored
        let valueToStoreInLocalStorage: any = valueToStore;
        
        if (expiresIn) {
          valueToStoreInLocalStorage = {
            value: valueToStore,
            expiresAt: new Date().getTime() + expiresIn,
          };
        }
        
        // Save to localStorage
        window.localStorage.setItem(
          key,
          serialize ? JSON.stringify(valueToStoreInLocalStorage) : String(valueToStoreInLocalStorage)
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue, expiresIn]
  );

  // Remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue as T);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs if enabled
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== event.oldValue) {
        setStoredValue(getStoredValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, getStoredValue, syncAcrossTabs]);

  // Only run this effect on mount to avoid unnecessary re-renders
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Update state if localStorage changes from another hook instance
    setStoredValue(getStoredValue());
  }, [getStoredValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * A simpler version of useLocalStorage with just key and initialValue
 */
export function useLocalStorageSimple<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useLocalStorage<T>({ key, initialValue });
}

// Example usage:
/*
// Simple usage
const [name, setName] = useLocalStorage<string>('name', 'John');

// With options
const [user, setUser, removeUser] = useLocalStorage<User>({
  key: 'user',
  initialValue: { id: 1, name: 'John' },
  expiresIn: 1000 * 60 * 60 * 24, // 24 hours
  syncAcrossTabs: true,
});

// With expiration
const [token, setToken] = useLocalStorage<string>({
  key: 'auth_token',
  initialValue: '',
  expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
});

// Remove item
const handleLogout = () => {
  removeUser();
  // or setUser(undefined);
};
*/
