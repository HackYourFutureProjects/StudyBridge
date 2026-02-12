import { TeacherCard } from "../teacherCard/teacherCard";
import { TeacherType } from "../../api/teacher/teacher.type";

type CardsListType = {
  cards: TeacherType[];
};

export const CardsList = ({ cards }: CardsListType) => {
  return (
    <div className="flex flex-col gap-7.5">
      {cards.map((card) => (
        <TeacherCard key={card.id} teacher={card} />
      ))}
    </div>
  );
};
