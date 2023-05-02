import { useState } from "react";
import { useQuery } from "react-query";
import { Message } from "@/src/types/message/messageType";
import { getMessage } from "@/src/api/message/messageApi";

const useGetMessage = (roomId: number , page: number , size: number ) => {
  const [roomList, setRoomList] = useState<any>([]); // 화면
  const [messageList, setMessageList] = useState<any>([]);
  const [myInfo, setMyInfo] = useState<Message>();
  const [receiverInfo, setReceiverInfo] = useState<Message>();
  
  const { data: messageData, refetch } = useQuery({
    enabled: roomId !== 0,
    refetchOnWindowFocus: false,
    queryKey: ["message", page],
    queryFn: () => { return getMessage(roomId, page, size)},
    onSuccess: (item) => {
      setRoomList(item);
      setMessageList(item);
      item?.map((message) => {
        if (message.sender === true) {
          setMyInfo(message);
        } else {
          setReceiverInfo(message);
        }
      })
    },
  });

  return {
    roomList,
    refetch,
    messageList,
    setMessageList,
    myInfo,
    receiverInfo,
    messageData: messageData
  };
};

export default useGetMessage;
