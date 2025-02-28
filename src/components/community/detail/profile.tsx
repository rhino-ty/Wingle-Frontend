import { getImageUrl } from "@/src/modules/utils";
import { useState } from "react";
import styled from "styled-components";
import Modal from "../../modal";
import { Margin, Text } from "../../ui";
import betweenTime from "@/src/utils/betweenTime";
import { countryImg } from "@/src/modules/utils";
import { useRouter } from "next/router";
import UnivLabel from "../../ui/univLabel";

export default function Profile({
  article,
  currentTab,
}: {
  article: Article;
  currentTab: string;
}): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    isMine,
    userNickname,
    createdTime,
    forumId,
    articleId,
    userId,
    userSchoolName,
  } = article;
  const onClickModal = (): void => {
    setModalVisible((prev) => !prev);
  };

  const time = betweenTime(createdTime);
  const router = useRouter();
  return (
    <>
      <S.Profile>
        <S.ProfileLeft>
          {currentTab === "교류" ? (
            <S.ImageBox
              onClick={(): void => {
                router.push(`/profile?userID=${userId}`);
              }}
            >
              <S.ProfileImg
                src={
                  article.userImage
                    ? article.userImage
                    : getImageUrl(currentTab)
                }
              />
              <S.NationIcon src={countryImg(article.userNation)} />
            </S.ImageBox>
          ) : (
            <S.ProfileImg src={getImageUrl(currentTab)} />
          )}
          <Margin direction="row" size={10} />
          <S.ProfileInfo>
            <S.HeaderTop>
              <Text.Body6 color="gray900">{userNickname}</Text.Body6>
              <UnivLabel univ={userSchoolName} />
            </S.HeaderTop>
            <Text.Caption3 color="gray500">{time}</Text.Caption3>
          </S.ProfileInfo>
        </S.ProfileLeft>
        {isMine && (
          <S.CancelImg
            src="/community/detail/close-gray.svg"
            onClick={onClickModal}
          />
        )}
      </S.Profile>
      {modalVisible && (
        <Modal
          type="detail-delete-contents"
          deleteInform={{
            forumId: String(forumId),
            articleId: String(articleId),
            id: 0,
          }}
          onClickModal={onClickModal}
        />
      )}
    </>
  );
}

const S = {
  Profile: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 65px 24px 8px 24px;
  `,

  ProfileImg: styled.img`
    border-radius: 50%;
    width: 36px;
    height: 36px;
  `,

  ProfileInfo: styled.div`
    display: flex;
    flex-direction: column;
  `,
  ImageBox: styled.div`
    position: relative;
    width: 36px;
    height: 36px;
    cursor: pointer;
  `,
  NationIcon: styled.img`
    width: 16px;
    height: 16px;
    border-radius: 100px;
    position: absolute;
    right: 0%;
    bottom: 0%;
    z-index: 0;
    cursor: pointer;
  `,
  ProfileLeft: styled.div`
    display: flex;
    flex-direction: row;
  `,
  HeaderTop: styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  CancelImg: styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
  `,
};
