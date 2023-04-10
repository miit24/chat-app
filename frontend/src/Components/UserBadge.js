import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { useContext } from "react";
import { Store } from "../Store";

const UserBadge = ({ user, handleFunction, admin }) => {
  const { state, dispatch: ctxDispatch, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain } = useContext(Store);
  const { userInfo } = state;
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"

    >
      {user.name}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      {admin && <CloseIcon pl={1}
        display={user._id != userInfo._id ? "inline" : "none"}
        onClick={handleFunction} />}
    </Badge>
  );
};

export default UserBadge;
