import "../assets/css/styles.css";
import "../assets/js/pages/index.js";
import { animate } from "animejs";

console.log("Vite connecté ");

animate("h1", {
    translateY: [-25, 0],
    opacity: [0, 1],
    duration: 900,
    easing: "ease-out",
  });
  

  