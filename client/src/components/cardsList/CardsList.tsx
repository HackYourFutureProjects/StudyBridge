import { TeacherCard } from "../teacherCard/teacherCard";
import { TeacherType } from "../../api/teacher/teacher.type";
import { motion, type Variants } from "framer-motion";
type CardsListType = {
  cards: TeacherType[];
};

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 150 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export const CardsList = ({ cards }: CardsListType) => {
  return (
    <motion.div
      className="flex flex-col gap-7.5"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((teacher) => (
        <motion.div key={teacher.id} variants={itemVariants}>
          <TeacherCard teacher={teacher} />
        </motion.div>
      ))}
    </motion.div>
  );
};
