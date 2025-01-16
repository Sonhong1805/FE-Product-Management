import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.scrollHeight,
      });
    };

    window.addEventListener("resize", updateSize);
    window.addEventListener("scroll", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("scroll", updateSize);
    };
  }, []);

  return size;
};

export default useWindowSize;
