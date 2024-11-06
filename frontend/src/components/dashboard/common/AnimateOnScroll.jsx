// AnimateOnScroll.js
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


const AnimateOnScroll = ({ children, animation, duration, delay }) => {
  useEffect(() => {
    AOS.init({ duration, once: true });
  }, [duration]);

  // Clone the child to add props if it's a single element
  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children, {
        "data-aos": animation,
        "data-aos-delay": delay,
      })
    : children;

  return <>{childWithProps}</>;
};

export default AnimateOnScroll;

