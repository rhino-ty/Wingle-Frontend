import { ChangeEvent, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Margin } from "../../ui";
import instance from "@/src/api/axiosModule";
import { useMutation, useQueryClient } from "react-query";

export default function CommentInput(props: { forumId: number, articleId: number }) {
  const [comment, setComment] = useState<string>("");

  const fetchComments = async () => {
    const response = await instance.post(`/community/articles/comments`, {
      forumId: props.forumId,
      articleId: props.articleId,
      originCommentId: 0,
      content: comment,
    });
    return response.data;
  }

  const queryClient = useQueryClient();

  const updateComment = useMutation(fetchComments, {
    onMutate: async (newComment) => {
      await queryClient.cancelQueries('comments');
      const prevComments = queryClient.getQueryData('comments');
      if(prevComments) {
        queryClient.setQueryData('comments', (prevData : any) => {
          console.log(prevData);
          return { ...prevData, data: [...prevData.data, newComment]}
        });
      }
      return { prevComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
    },
    onError: (error, payload, context) => {
      console.log(`댓글 작성 실패! ${error}`);
      queryClient.setQueryData('comments', context?.prevComments);
    }
  });

  const onChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef?.current?.scrollHeight + "px";
    }
  }, []);

  return (
    <Style.Wrapper>
      <Style.CommentInput
        placeholder="댓글을 입력해보세요."
        onChange={onChangeComment}
        maxLength={500}
        rows={1}
        ref={inputRef}
        onInput={handleResizeHeight}
        value={comment}
      />
      <Margin direction="row" size={8}></Margin>
      <Style.PostIcon
        src={
          comment
            ? "/community/detail/send.svg"
            : "/community/detail/send-disable.svg"
        }
        onClick={() => {
          comment && updateComment.mutate();
          setComment("");
        }}
      />
    </Style.Wrapper>
  );
}

const Style = {
  Wrapper: styled.div`
    padding: 12px 24px 12px 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eeeef2;
    background-color: #fff;
  `,

  CommentInput: styled.textarea`
    width: 100%;
    max-height: 56px;
    border: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    ::placeholder {
      color: #959599;
    }
    resize: none;
    padding: 0;
    background-color: inherit;
  `,

  PostIcon: styled.img`
    width: 32px;
    height: 32px;
  `,
};
