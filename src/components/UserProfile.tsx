import { createSignal, onMount, Show, type Component } from "solid-js";
import { checkUser, getProfilePicture, type User } from "../utils/client";

const UserProfile: Component = () => {
  const [user, setUser] = createSignal<User | null>(null);
  const profilePicture = getProfilePicture();

  onMount(async () => {
    const user = await checkUser();
    setUser(user);
  })

  return (
    <Show when={user()} fallback={
      <a href="/identification" class="bg-white text-black font-500 py-1.5 px-4">
        S'identifier
      </a>
    }>
      {user => (
        <div class="flex items-center gap-4">
          <div class="text-white text-right">
            <p><span class="font-300">{user().firstName}</span> {user().lastName}</p>
            <p class="text-xs opacity-50">Étudiant à l'IUT du Limousin</p>
          </div>

          <img
            class="rounded-full w-11 h-11 border-2 border-white bg-white"
            src={profilePicture ?? "/default.png"}
          />
        </div>
      )}
    </Show>
  )
}

export default UserProfile;
