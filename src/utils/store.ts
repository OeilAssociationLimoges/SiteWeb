import { createSignal, onMount, createRoot } from "solid-js";
import { type User, checkUser, logout } from "./client";

export default createRoot(() => {
  const [user, setUser] = createSignal<User | null>(null);
  
  onMount(async () => {
    const user = await checkUser();
    setUser(user);
  });

  return {
    get user () {
      return user();
    },
    async logout () {
      logout();
      setUser(null);
    }
  }
});
