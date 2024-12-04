 import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const UserContext = createContext();

// const serverURL = "http://192.168.54.63:5000"
const serverURL = "http://localhost:5000"

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    const updateUserFromToken = async () => {
      const token = cookies.token;
      if (token && !user) {
        try {
          const response = await fetch(`${serverURL}/api/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      }
    };

    updateUserFromToken();
  }, [cookies.token, user]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
