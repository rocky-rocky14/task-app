"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserName, setUserName } from "@/lib/user";

interface UserContextValue {
  userName: string;
  setUserName: (name: string) => void;
  isReady: boolean;
}

const UserContext = createContext<UserContextValue>({
  userName: "",
  setUserName: () => {},
  isReady: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUserNameState(getUserName());
    setIsReady(true);
  }, []);

  const updateUserName = (name: string) => {
    setUserName(name);
    setUserNameState(name);
  };

  return (
    <UserContext.Provider value={{ userName, setUserName: updateUserName, isReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
