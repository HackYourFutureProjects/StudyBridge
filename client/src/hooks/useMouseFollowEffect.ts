import { useEffect } from "react";

export const useMouseFollowEffect = () => {
  useEffect(() => {
    let spotlightElement: HTMLDivElement | null = null;

    const createSpotlight = () => {
      spotlightElement = document.createElement("div");
      spotlightElement.style.position = "fixed";
      spotlightElement.style.width = "28px";
      spotlightElement.style.height = "28px";
      spotlightElement.style.borderRadius = "50%";
      spotlightElement.style.background =
        "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 80%, transparent 100%)";
      spotlightElement.style.pointerEvents = "none";
      spotlightElement.style.zIndex = "9999";
      spotlightElement.style.mixBlendMode = "screen";
      spotlightElement.style.opacity = "0";
      spotlightElement.style.transition = "opacity 0.2s ease";
      spotlightElement.style.filter = "brightness(1.3)";
      document.body.appendChild(spotlightElement);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightElement) createSpotlight();

      const target = e.target as HTMLElement;
      const targetElement = target.matches(
        "h1, h2, h3, h4, h5, h6, .text-gradient",
      )
        ? target
        : target.closest("h1, h2, h3, h4, h5, h6, .text-gradient");

      if (targetElement && spotlightElement) {
        spotlightElement.style.left = `${e.clientX - 14}px`;
        spotlightElement.style.top = `${e.clientY - 14}px`;
        spotlightElement.style.opacity = "1";

        (targetElement as HTMLElement).style.textShadow =
          "0 0 8px rgba(255,255,255,0.5)";
        (targetElement as HTMLElement).style.transition =
          "text-shadow 0.2s ease";
      } else {
        if (spotlightElement) {
          spotlightElement.style.opacity = "0";
        }

        const allElements = document.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, .text-gradient",
        );
        allElements.forEach((element) => {
          (element as HTMLElement).style.textShadow = "";
        });
      }
    };

    const handleMouseLeave = () => {
      if (spotlightElement) {
        spotlightElement.style.opacity = "0";
      }

      const allElements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, .text-gradient",
      );
      allElements.forEach((element) => {
        (element as HTMLElement).style.textShadow = "";
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (spotlightElement) {
        document.body.removeChild(spotlightElement);
      }
    };
  }, []);
};
