import { type Component } from "solid-js";

const PresentationCardWhois: Component<{
  name: string;
  role: string;
  right?: number;
  left?: number;
  center?: boolean
}> = (props) => {
  return (
    <div class="card-whois absolute bottom-0 bg-white text-black px-4 py-2 z-35 bottom-4"
      style={
        props.center ? { left: "0", right: "0", margin: "auto", "text-align": "center" } :
        props.left ? { left: props.left + "px" } : { right: props.right + "px" }
      }
    >
      <p class="text-sm md:text-xl font-500">{props.name}</p>
      <p class="text-xs md:text-lg">{props.role}</p>
    </div>
  )
};

export default PresentationCardWhois;
