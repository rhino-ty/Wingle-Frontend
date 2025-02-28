import instance from "@/src/api/axiosModule";
import Modal from "@/src/components/modal";
import { Text } from "@/src/components/ui";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";

export default function Create(): JSX.Element {
  const router = useRouter();
  const { tab: currentTab, forumId } = router.query;
  const [contents, setContents] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const queryClient = useQueryClient();

  const onChangeContents = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setContents(event.target.value);
  };
  const onClickModal = (): void => {
    if (contents) {
      setModalVisible((prev) => !prev);
    } else {
      router.back();
    }
  };

  const fetchArticle = async (): Promise<void | Article> => {
    if (!forumId) {
      return;
    }
    const formData = new FormData();
    formData.append("forumId", forumId.toString());
    formData.append("content", contents);
    const { data: response } = await instance.post(
      `/community/articles`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  const updateArticle = useMutation(fetchArticle, {
    onMutate: async () => {
      await queryClient.cancelQueries("articles");
      const prevArticles = queryClient.getQueryData(["articles"], {
        exact: false,
      });
      return { prevArticles };
    },
    onSuccess: (data) => {
      setContents("");
      queryClient.invalidateQueries("articles");
      if (!data) return;
      router.replace({
        pathname: `/community/detail`,
        query: { tab: currentTab, forumId: forumId, articleId: data.articleId },
      });
    },
    onError: (error, payload, context) => {
      console.log(`게시글 작성 실패! ${error}`);
      queryClient.setQueryData("articles", context?.prevArticles);
    },
    onSettled: () => {
      queryClient.invalidateQueries("articles");
    },
  });

  return (
    <S.Wrapper>
      <S.Header>
        <S.HeaderLeft>
          <S.BackArrow src="/community/arrow-back.svg" onClick={onClickModal} />
          <Text.Title2 color="gray900">{currentTab}게시판 글 작성</Text.Title2>
        </S.HeaderLeft>
        <S.CreateButton>
          <Text.Body1
            pointer={contents ? true : false}
            color={contents ? "gray900" : "gray500"}
            onClick={(): void => updateArticle.mutate()}
          >
            등록
          </Text.Body1>
        </S.CreateButton>
      </S.Header>
      <S.Body>
        <S.Contents
          placeholder="자유롭게 글을 작성해보세요!"
          onChange={onChangeContents}
          maxLength={3000}
          value={contents}
        />
      </S.Body>
      {modalVisible && <Modal type="create-back" onClickModal={onClickModal} />}
    </S.Wrapper>
  );
}

const S = {
  Wrapper: styled.div`
    width: 100%;
  `,

  Header: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px 24px;
  `,

  HeaderLeft: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,

  BackArrow: styled.img`
    margin-right: 14.5px;
    cursor: pointer;
  `,

  CreateButton: styled.button`
    border: none;
  `,

  Body: styled.div`
    padding: 16px 24px 24px 24px;
  `,

  Contents: styled.textarea`
    width: 100%;
    height: 600px;
    font-weight: 400;
    font-size: 16px;
    font-family: "Pretendard Variable", Pretendard;
    line-height: 140%;
    color: #222223;
    ::placeholder {
      color: #959599;
    }
    resize: none;
    border: none;
    padding: 0;
    background-color: inherit;
  `,
};
