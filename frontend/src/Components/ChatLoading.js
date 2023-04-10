import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = ({ num }) => {
  console.log(Array(num))
  return (
    <Stack>
      {Array(num).map((e, i) => {
        return <Skeleton height="45px" />
      })}
    </Stack>
  );
};

export default ChatLoading;