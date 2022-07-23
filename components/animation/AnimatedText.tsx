import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

// Word wrapper
type WrapperProps = {
  children: ReactNode;
};
const Wrapper = (props: WrapperProps): JSX.Element => {
  // We'll do this to prevent wrapping of words using CSS
  return <span className="word-wrapper inline-block">{props.children}</span>;
};

export type AnimatedCharactersProps = {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  color?: string;
  startColor?: string;
};

// AnimatedCharacters
// Handles the deconstruction of each word and character to setup for the
// individual character animations
const AnimatedCharacters = ({
  text,
  tag: Tag = "span",
  className = "",
  color = "#3143A1",
  startColor = "#FF0088",
}: AnimatedCharactersProps) => {
  // Framer Motion variant object, for controlling animation
  const item: Variants = {
    hidden: {
      y: "200%",
      rotate: Math.random() * 100,
      opacity: 0,
      color: startColor,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 },
    },
    exit: {
      y: "200%",
      rotate: Math.random() * 100,
      opacity: 0,
      color: startColor,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.05 },
    },
    visible: {
      y: 0,
      rotate: 0,
      opacity: 1,
      color: color,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.45 },
    },
  };

  //  Split each word of props.text into an array
  const splitWords = text.split(" ") || [];

  // Push each word into words array
  const words = splitWords.map((word) => word.split(""));

  // Add a space ("\u00A0") to the end of each word
  words.map((word) => {
    return word.push("\u00A0");
  });

  // Get the tag name from tagMap

  return (
    <Tag className={className}>
      {words.map((word, index) => {
        return (
          // Wrap each word in the Wrapper component
          <Wrapper key={index}>
            {words[index].flat().map((element, index) => {
              return (
                <span
                  style={{
                    overflow: "hidden",
                    display: "inline-block",
                  }}
                  key={index}
                >
                  <motion.span
                    style={{ display: "inline-block" }}
                    variants={item}
                  >
                    {element}
                  </motion.span>
                </span>
              );
            })}
          </Wrapper>
        );
      })}
    </Tag>
  );
};

export default AnimatedCharacters;
