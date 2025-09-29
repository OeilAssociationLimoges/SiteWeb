import { createSignal, type Component, Show } from "solid-js";
import IconOeil from '~icons/local/oeil'
import IconClose from '~icons/mdi/close'
import IconMenu from '~icons/mdi/menu'
import UserProfile from "./UserProfile";

import { createMediaQuery } from "@solid-primitives/media";

const NavMenu: Component = () => {
  const [open, setOpen] = createSignal(false);
  const isContainedInMenu = createMediaQuery("(max-width: 767px)", true);

  return (
    <nav class="fixed top-0 inset-x-0 z-20 h-24 flex items-center justify-between px-8 bg-black md:backdrop-blur-xl md:bg-black/80">
      <div class="flex items-center justify-between w-full gap-6">
        <a class="text-white" href="/">
          <IconOeil class="text-6xl" />
        </a>

        <Show when={open() || !isContainedInMenu()}>
          <div class="md:bg-transparent h-full w-full md:gap-6 bg-black pb-6 md:pb-0 z-20 fixed md:relative top-24 md:top-0 md:z-0 left-0 right-0 gap-2 text-white flex flex-col md:flex-row items-center"
          >
            <a class="py-6 block font-300 text-4 text-white/80 tracking-wide hover:text-white transition-colors" href="/#agenda"
              onClick={() => setOpen(false)}
            >
              Agenda
            </a>
            <a class="py-6 block font-300 text-4 text-white/80 tracking-wide hover:text-white transition-colors" href="/#presentation"
              onClick={() => setOpen(false)}
            >
              Présentation
            </a>
            <a class="py-6 block font-300 text-4 text-white/80 tracking-wide hover:text-white transition-colors" href="/#partenaires"
              onClick={() => setOpen(false)}
            >
              Partenaires
            </a>
            <a class="py-6 block font-300 text-4 text-white/80 tracking-wide hover:text-white transition-colors md:mr-auto" href="/shop"
              onClick={() => setOpen(false)}
            >
              Shop
            </a>

            <UserProfile />
          </div>
        </Show>
      </div>

      <Show when={isContainedInMenu()}>
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
        >
          <Show when={open()} fallback={<IconMenu class="text-white text-2xl" />}>
            <IconClose class="text-white text-2xl" />
          </Show>
        </button>
      </Show>
    </nav>
  )
};

export default NavMenu;
