import { TeacherCard } from "../teacherCard/teacherCard";
import { TeacherStatus, TeacherType } from "../../api/teacher/teacher.type";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useRef } from "react";
type CardsListType = {
  cards: TeacherType[];
  changeStatus?: (id: string, status: TeacherStatus) => void;
  isStatusPending?: boolean;
};

export const CardsList = ({
  cards,
  changeStatus,
  isStatusPending,
}: CardsListType) => {
  const reduceMotion = useReducedMotion();

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? undefined
        : { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const itemVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.12 } },
      }
    : {
        hidden: { opacity: 0, x: 150 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.25, ease: "easeOut" },
        },
      };
  const playedRef = useRef(false);
  return (
    <motion.div
      className="flex flex-col gap-7.5"
      variants={listVariants}
      initial="hidden"
      animate="show"
      onAnimationComplete={() => {
        playedRef.current = true;
      }}
    >
      {cards.map((teacher) => (
        <motion.div key={teacher.id} variants={itemVariants}>
          <TeacherCard
            isStatusPending={isStatusPending}
            changeStatus={changeStatus}
            teacher={teacher}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
