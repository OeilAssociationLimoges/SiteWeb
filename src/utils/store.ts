import { createSignal, onMount, createRoot } from "solid-js";
import { type User, checkDiscount, checkUser, logout, safeStorage } from "./client";

export default createRoot(() => {
  const [user, setUser] = createSignal<User | null>(null);
  const [discount, _setDiscount] = createSignal<boolean>(safeStorage?.getItem("discount") === "1");
  
  const setDiscount = (value: boolean) => {
    _setDiscount(value);

    // On stocke la valeur depuis le `localStorage` pour avoir les valeurs
    // directement sans avoir à attendre que le serveur réponde.
    safeStorage?.setItem("discount", value ? "1" : "0");
  }

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
