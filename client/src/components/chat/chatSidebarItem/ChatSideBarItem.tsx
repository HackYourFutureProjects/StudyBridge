import imageNotFound from "../../../assets/images/image-not-found.png";

type ChatSidebarItemType = {
  imageUrl?: string | null;
  name?: string | null;
};

export const ChatSideBarItem = ({ imageUrl, name }: ChatSidebarItemType) => {
  return (
    <div className="flex items-center gap-3">
      <img
        width="40"
        height="40"
        className="rounded-full"
        src={imageUrl ? imageUrl : imageNotFound}
        alt="user avatar"
      />
      <span className="text-light-100 text-base">{name}</span>
    </div>
  );
};
