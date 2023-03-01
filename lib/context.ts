import { createContext } from "react";

interface IUserContext {
  user: any | {} | null;
  username: string | null;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  username: null,
});
