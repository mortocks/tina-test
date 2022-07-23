import { Container } from "../components/util/container";
import { Section } from "../components/util/section";
import { ExperimentalGetTinaClient } from "../.tina/__generated__/types";
import { Layout } from "../components/layout";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../components/animation/AnimatedText";
import { useState } from "react";
import Lottie from "react-lottie-player";
import boxAnimation from "../lottie/box.json";

type QuestionProps = {
  text: string;
  message: string;
  buttonText?: string;
  noAnswer?: boolean;
  onNext?: (value: string) => void;
};

const Question = ({
  text,
  onNext,
  message,
  buttonText = "Next",
  noAnswer = false,
}: QuestionProps) => {
  const [result, setResult] = useState("");

  const container = {
    visible: {
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const answerVariants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: `blur(0px)`,
      transition: {
        //delay: 1.0,
        duration: 0.85,
      },
    },
    hidden: {
      opacity: 0,
      y: 100,
      filter: `blur(50px)`,
      transition: {
        //delay: 0,
        ease: [0.455, 0.03, 0.515, 0.955],
        duration: 0.85,
      },
    },
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (result === "") {
      return;
    }
    onNext(result);
  }

  // Footer alignment
  const footerClass = noAnswer ? "justify-center" : "justify-end";

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        className="App"
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, amount: "some" }}
        variants={container}
      >
        <motion.div
          className="text-xl text-green-200 mb-2 w-3/4"
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          transition={{ delay: 0 }}
          variants={answerVariants}
        >
          {message}
        </motion.div>

        <AnimatedText
          text={text}
          tag="span"
          color="#ffffff"
          className={`w-full relative	mb-10 text-6xl tracking-normal leading-tight font-bold font-serif`}
        />
      </motion.div>

      {!noAnswer && (
        <motion.input
          autoFocus
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          variants={answerVariants}
          className={`
        bg-transparent border-none 
        focus:ring-0 focus:ring-offset-0 focus:outline-0 outline-0 focus:outline-none
        w-full relative	mb-10
        text-white text-5xl font-extrabold tracking-normal leading-tight title-font font-serif
        placeholder-blue-300`}
          placeholder=" Type your answer"
          onChange={(e) => {
            setResult(e.target.value);
          }}
        />
      )}

      <div className={`flex py-10 ${footerClass}`}>
        <button
          disabled={result === "" && noAnswer === false}
          onClick={() => onNext(result)}
          className="disabled:opacity-25 transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

type QuestionSchema = {
  message: string;
  question: string;
  segmentStart: number;
  segmentEnd: number;
  buttonText?: string;
  noAnswer?: boolean;
  onNext?: (value: string) => void;
};

export default function GettingStarted() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [segmentFrom, setSegmentFrom] = useState(0);
  const [segmentTo, setSegmentTo] = useState(100);

  const [clinicName, setClinicName] = useState<string | null>();

  const questions: QuestionSchema[] = [
    {
      message:
        "Welcome to always, we have a few basic questions to get you your first box 🗳️",
      question: "Lets focus on getting a single Dentist and Nurse setup",
      segmentStart: 0,
      segmentEnd: 90,
      noAnswer: true,
      buttonText: "Lets get started",
    },
    {
      message: "It’s time we got to know each other 🤝",
      question: "Lets start by telling us your clinics name.",
      segmentStart: 0,
      segmentEnd: 90,
      onNext: (value) => setClinicName(value),
    },
    {
      message: `Nice to meet you ${clinicName} 👋`,
      question: "What size gloves does your dentist and nurse prefer?",
      segmentStart: 100,
      segmentEnd: 150,
    },
    {
      message: "Help comes in all different sizes. 🧤",
      question: "How much storage does your clinic have?",
      segmentStart: 0,
      segmentEnd: 90,
    },
  ];

  const {
    message,
    question,
    buttonText = "Next",
    noAnswer = false,
    onNext,
  } = questions[questionIndex % questions.length];

  const nextSlide = (value: string) => {
    if (onNext) {
      onNext(value);
    }
    const nextIndex = (questionIndex + 1) % questions.length;
    setSegmentFrom(questions[nextIndex].segmentStart);
    setSegmentTo(questions[nextIndex].segmentEnd);
    setQuestionIndex(nextIndex);
  };

  return (
    <Layout>
      <Section className="flex-1 flex items-center" color="primary">
        <Container size="large">
          <div className="flex md:flex-row flex-col w-full">
            <div className="flex align-center justify-center md:w-[500px] md:h-[500px] col z-1 mr-8 overflow-visible">
              <Lottie
                loop={false}
                animationData={boxAnimation}
                play
                style={{ width: 500, height: 500, overflow: "visible" }}
                segments={[segmentFrom, segmentTo]}
              />
            </div>
            <div
              className="flex items-center justify-center flex-grow w-full h-[500px] z-1"
              style={{ zIndex: 1, position: "relative" }}
            >
              <AnimatePresence exitBeforeEnter>
                <Question
                  key={question}
                  text={question}
                  onNext={nextSlide}
                  message={message}
                  noAnswer={noAnswer}
                  buttonText={buttonText}
                />
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const client = ExperimentalGetTinaClient();
  const tinaProps = await client.PageQuery();
  return {
    props: {
      ...tinaProps,
    },
  };
};

// eslint-disable-next-line
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  // eslint-disable-next-line
  T extends (...args: any) => Promise<infer R> ? R : any;
