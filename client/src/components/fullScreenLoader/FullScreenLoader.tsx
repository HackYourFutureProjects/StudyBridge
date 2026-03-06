import { LogoPulseIcon } from "../LogoPulsIcon/LogoPulseIcon.tsx";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export const FullScreenLoader = ({ isOpen }: Props) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-bg-main">
      <LogoPulseIcon />
    </div>
  );
};
