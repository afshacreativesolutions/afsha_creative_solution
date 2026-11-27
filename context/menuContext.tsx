"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ThemeContextType = {
  menu: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
};

const MenuContext = createContext<ThemeContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuState, setMenuState] = useState(false);

  const toggleMenu = () => {
    setMenuState((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  const openMenu = () => {
    setMenuState(true);
  };

  return (
    <MenuContext.Provider value={{ menu: menuState, toggleMenu, closeMenu, openMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used inside MenuProvider");
  }

  return context;
}

export function useOptionalMenu() {
  return useContext(MenuContext) ?? null;
}
