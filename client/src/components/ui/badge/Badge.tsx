type BadgeType = {
  title: string;
};

export const Badge = ({ title }: BadgeType) => {
  return (
    <div
      className="flex items-center
    justify-center px-3 py-1 bg-dark-900 text-light-100
    text-[10px]  rounded-[20px] border border-gray-500"
    >
      {title}
    </div>
  );
};
