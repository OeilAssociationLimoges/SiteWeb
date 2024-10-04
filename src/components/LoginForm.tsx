import { type Component, createSignal, Show } from "solid-js";
import IconEyeOutline from 'virtual:icons/mdi/eye-outline'
import IconEyeOffOutline from 'virtual:icons/mdi/eye-off-outline'
import { setProfilePicture } from "../utils/client";

const LoginForm: Component = () => {
  const [showPassword, setShowPassword] = createSignal(false);

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username(), password: password() })
      });

      if (response.ok) {
        const json = await response.json() as {
          token: string
          // as base64
          profilePicture: string | null
        }

        localStorage.setItem('token', json.token);
        if (json.profilePicture) setProfilePicture(json.profilePicture);

        // go back to home page
        window.location.href = '/';
      }
      else throw new Error("Une erreur est survenue lors de la connexion à Biome")
    }
    catch (e) {
      const error = e as Error;
      setError(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <form class="border-4 border-white max-w-[460px] w-full" onSubmit={handleFormSubmit}>
      <div class="p-4 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label for="username">
            $nom_d_utilisateur
          </label>
          <input
            value={username()}
            onInput={e => setUsername(e.currentTarget.value)}
            type="text"
            id="username"
            name="username"
            class="border-b-2 border-white bg-[#0E0E0E] transition-colors focus:bg-[#1E1E1E] w-full py-3 px-4 outline-none"
          />
        </div>

        <div class="flex flex-col gap-2 group">
          <label for="password">
            $mot_de_passe
          </label>
          <div class="flex items-center border-b-2 border-white transition-colors bg-[#0E0E0E] group-focus-within:bg-[#1E1E1E] pr-2.5">
            <input
              type={showPassword() ? "text" : "password"}
              value={password()}
              onInput={e => setPassword(e.currentTarget.value)}
              id="password"
              name="password"
              class="bg-transparent w-full py-3 px-4 outline-none"
            />
            <button
              type="button"
              title="Afficher le mot de passe"
              onClick={() => setShowPassword(prev => !prev)}
              class="hover:bg-[#2F2F2F] p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity"
            >
              <Show when={showPassword()} fallback={<IconEyeOutline class="text-xl" />}>
                <IconEyeOffOutline class="text-xl" />
              </Show>
            </button>
          </div>
        </div>
      </div>

      <Show when={error()}>
        <p class="text-red">{error()}</p>
      </Show>

      <button
        disabled={loading()}
        type="submit"
        class="bg-white text-black text-lg font-700 py-3 mt-2 w-full hover:bg-white/80 focus:bg-white/80 border-white border-t-4 transition-colors"
      >
        {loading() ? "connexion en cours..." : "login"}
      </button>
    </form>
  )
};

export default LoginForm;
