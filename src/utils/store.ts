import { createSignal, onMount, createRoot } from "solid-js";
import { type User, checkDiscount, checkUser, logout } from "./client";

export default createRoot(() => {
  const [user, setUser] = createSignal<User | null>(null);
  const [discount, setDiscount] = createSignal<boolean>(false);
  
  onMount(async () => {
    checkUser().then(setUser);
    checkDiscount().then(setDiscount);
  });

  return {
    get user () {
      return user();
    },
    get discount () {
      return discount();
    },
    async logout () {
      logout();
      location.reload();
    }
  }
});
