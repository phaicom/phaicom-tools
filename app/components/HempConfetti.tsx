import confetti from "canvas-confetti";
import { useRef } from "react";
import { GiHemp } from "react-icons/gi";

export const HempConfetti = () => {
  const lastShotRef = useRef(0);

  const shoot = () => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    if (now - lastShotRef.current < 250) return;
    lastShotRef.current = now;

    const hempShape = confetti.shapeFromText({
      text: "🌿",
      scalar: 1.8,
    });

    const bursts = 5;

    for (let i = 0; i < bursts; i++) {
      setTimeout(async () => {
        await confetti({
          particleCount: i === 2 ? 22 : 16,
          spread: 130 + Math.random() * 30,
          startVelocity: 40 + Math.random() * 10,
          decay: 0.9,
          gravity: 1,
          drift: (Math.random() - 0.5) * 1.5,
          ticks: 180,

          scalar: Math.random() * 0.4 + 1.2,

          shapes: [hempShape],

          origin: {
            x: Math.random(),
            y: Math.random() * 0.5,
          },
        });
      }, i * 45);
    }
  };

  return (
    <GiHemp
      onClick={shoot}
      className="hemp-icon size-8 cursor-pointer transition select-none hover:rotate-6 active:scale-90"
    />
  );
};
