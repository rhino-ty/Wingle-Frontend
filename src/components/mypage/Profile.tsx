import styled from "styled-components";
import { Text } from "@/src/components/ui";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { profileStateAtom } from "@/src/atoms/profileStateAtom";
import { getImageUrl, countryImg } from "@/src/modules/utils";
import useGetProfile from "@/src/hooks/mypage/useGetProfile";

export default function Profile() {
  // const [isRegisterBtnHover, setIsRegisterBtnHover] = useState(false);

  const { profileData } = useGetProfile();

  // const handleRegisterBtnHover = () => {
  //   setIsRegisterBtnHover(true);
  // };
  // const handleRegisterBtnLeave = () => {
  //   setIsRegisterBtnHover(false);
  // };

  return (
    <>
      <S.UserBox>
        <S.UserImgBox>
          <S.UserProfileImg
            src={
              profileData &&
              (profileData.image ? profileData.image : getImageUrl("기본"))
            }
            alt="프로필"
          />
          <S.UserFlagImg
            src={profileData && countryImg(profileData.nation)}
            alt="국기"
          />
        </S.UserImgBox>
        <S.UserInfoBox>
          <S.UserNicknameAndSex>
            <Text.Body1 color="gray900">
              {profileData && profileData.nickname}
            </Text.Body1>
            <S.UserSexImg
              src={
                profileData && profileData.gender
                  ? "/mypage/female.svg"
                  : "/mypage/male.svg"
              }
              alt="성별"
            />
          </S.UserNicknameAndSex>
          <Text.Body6 color="gray800">
            {profileData && profileData.nation}
          </Text.Body6>
        </S.UserInfoBox>
      </S.UserBox>
    </>
  );
}

const S = {
  UserBox: styled.div`
    display: flex;
    align-items: center;
    /* border-bottom: 1px solid #eeeef2; */
    gap: 14px;
    position: relative;
  `,
  UserImgBox: styled.div`
    width: 56px;
    height: 56px;
    position: relative;
  `,
  UserProfileImg: styled.img`
    width: 56px;
    height: 56px;
    position: absolute;
    border-radius: 100px;
    border: 1px solid #eeeef2;
  `,
  UserFlagImg: styled.img`
    width: 22px;
    height: 22px;
    position: absolute;
    border: 1px solid white;
    background-color: white;
    border-radius: 100px;
    right: 0%;
    bottom: 0%;
    z-index: 1;
  `,
  UserInfoBox: styled.div`
    width: 340px;
    height: 86px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  UserNicknameAndSex: styled.div`
    display: flex;
  `,
  UserSexImg: styled.img`
    width: 16px;
    height: 16px;
    padding-left: 4px;
    margin: 3px 0px;
  `,

  DropBubbleHigh: styled.div`
    position: absolute;
    top: 63px;
    left: 435px;
    border-bottom: 8px solid #303033;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  `,

  DropBubbleLow: styled.div`
    width: 153px;
    height: 42px;
    background-color: #303033;
    border-radius: 8px;
    position: absolute;
    top: 70px;
    left: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};
