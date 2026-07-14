import { useCallback } from "react";

export function useKeyboardControls({
  velocityRef,
  isDucking,
  dinoYRef,
  isDuckingRef,
  setIsDucking,
}) {
  const handleControls = useCallback(
    (e) => {
      if (isDuckingRef.current) return;
      if (e.code === "Space" && dinoYRef.current <= 0) {
        e.preventDefault();
        velocityRef.current = 16;
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        isDuckingRef.current = true;
        setIsDucking(true);
      }
    },
    [isDucking, dinoYRef, velocityRef, isDuckingRef, setIsDucking],
  );
  const handleControlsUp = useCallback(
    (e) => {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        isDuckingRef.current = false;
        setIsDucking(false);
      }
    },
    [isDucking, setIsDucking],
  );
  return {
    handleControls,
    handleControlsUp,
  };
}
