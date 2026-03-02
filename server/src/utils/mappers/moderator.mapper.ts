import { WithId } from "mongodb";
import { ModeratorTypeDB } from "../../db/schemes/types/moderator.types.js";
import { ModeratorViewType } from "../../types/moderator/moderator.js";

export const moderatorMapper = (
  moderator: WithId<ModeratorTypeDB>,
): ModeratorViewType => {
  return {
    id: moderator.id,
    firstName: moderator.firstName,
    lastName: moderator.lastName,
    email: moderator.email,
    profileImageUrl: moderator.profileImageUrl,
    createdAt: moderator.createdAt,
    role: moderator.role,
  };
};
