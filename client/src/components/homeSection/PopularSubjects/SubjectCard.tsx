interface SubjectCardProps {
  title: string;
}

export const SubjectCard = ({ title }: SubjectCardProps) => {
  return (
    <div className="card-subject">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
  );
};
