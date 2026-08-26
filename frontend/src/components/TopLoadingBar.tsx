import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";

const TopLoadingBar = () => {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let progressTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true);
      setProgress(20);
      progressTimer = setTimeout(() => setProgress(80), 300);
    } else {
      setProgress(100);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-0.8 z-100 bg-transparent">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopLoadingBar;
