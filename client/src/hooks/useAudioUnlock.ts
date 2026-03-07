import { useEffect, useRef } from "react";

export const useAudioUnlock = () => {
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    const unlockAudio = async () => {
      if (audioUnlockedRef.current) return;

      const probe = new Audio("/incomingCallTone.mp3");
      probe.muted = true;

      try {
        await probe.play();
        probe.pause();
        probe.currentTime = 0;
        audioUnlockedRef.current = true;
      } catch {
        //
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
    };
  }, []);
};
