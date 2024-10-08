import { type Component } from "solid-js";

const PresentationCardWhois: Component<{
  name: string;
  role: string;
  right?: number;
  left?: number;
  center?: boolean
}> = (props) => {
  return (
    <div class="absolute bottom-0 bg-white text-black px-4 py-2 z-35 bottom-4"
      style={
        props.center ? { left: "50%", transform: "translateX(-50%)" } :
        props.left ? { left: props.left + "px" } : { right: props.right + "px" }
      }
    >
      <h3 class="text-sm font-500">{props.name}</h3>
      <p class="text-xs">{props.role}</p>
    </div>
  )
};

export default PresentationCardWhois;
