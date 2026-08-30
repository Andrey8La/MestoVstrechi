import { createContext, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem("favorites") || "[]"));

  const toggle = (id) => {
    setFavs((p) => {
      const next = p.includes(id) ? p.filter((x) => x !== id) : [...p, id];
      localStorage.setItem("favorites", JSON.stringify(next)); // переживает перезагрузку
      return next;
    });
  };

  const isFav = (id) => favs.includes(id);

  return (
    <FavoritesContext.Provider value={{ favs, toggle, isFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}