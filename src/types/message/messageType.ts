export interface GetMessageResponse {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  recipientUserId: number;
  recipientImage: string;
  recipientSchoolName: string;
  messages: Message[];
}

export interface Message {
  messageId: number;
  nickname: null | string;
  content: string;
  createdTime: Date;
  sender: boolean;
}

export interface NewMsgProps {
  roomId: number;
  content: string;
  createdTime: string;
  sender: boolean;
}
