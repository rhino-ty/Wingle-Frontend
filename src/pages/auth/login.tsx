import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { Text, Margin } from "@/src/components/ui";
import { useMutation } from "react-query";
import { postLogin } from "@/src/api/auth/loginApi";
import { saveRefreshTokenToLocalStorage } from "@/src/utils/refreshTokenHandler";
import { saveAccessTokenToLocalStorage } from "@/src/utils/accessTokenHandler";
import { ErrorMent } from "@/src/components/authpage/signup/errorMent";

interface StyledInputProps {
  error: boolean;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { mutate: login } = useMutation(() => postLogin(email, password), {
    onSuccess: (res) => {
      // 액세스토큰 리프레쉬 토큰 로컬스토리지 넣기, admin에 따라 라우팅
      const { refreshToken, accessToken, admin } = res.data;
      saveRefreshTokenToLocalStorage(refreshToken);
      saveAccessTokenToLocalStorage(accessToken);
      router.push(admin ? "/admin" : "/community");
    },
    onError: () => {
      setError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  const handleSignup = () => {
    router.push("/auth/signup");
  };

  const isButtonDisabled =
    email.length < 8 || !email.includes("@") || !email.includes(".") || !password;

  return (
    <>
      <S.Header>
        <Image src="/auth/loginLogo.svg" alt="logo" priority width={200} height={200} />
        <Margin direction="column" size={8} />
        <Text.Body6 color="gray700">다함께 즐기는 국제교류 커뮤니티</Text.Body6>
      </S.Header>

      <form onSubmit={handleSubmit}>
        <S.AccountWrapper>
          <S.InputField error={error}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
            />
          </S.InputField>
          <S.InputField error={error}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
          </S.InputField>
          <ErrorMent error={error} errorMent="아이디 혹은 비밀번호를 정확히 입력해 주세요." />
        </S.AccountWrapper>

        <S.ButtonWrapper>
          <S.LoginButton disabled={isButtonDisabled} type="submit">
            로그인
          </S.LoginButton>
          <S.RegisterButton type="button" onClick={handleSignup}>
            회원가입
          </S.RegisterButton>
        </S.ButtonWrapper>
      </form>
    </>
  );
}

const S = {
  Header: styled.div`
    width: 200px;
    margin: 0 auto;
    padding: 48px;
  `,

  AccountWrapper: styled.div`
    padding-bottom: 30px;
  `,

  InputField: styled.div<StyledInputProps>`
    margin: 0 auto;
    width: 452px;
    height: 50px;
    border: 1px solid ${(props) => (props.error ? "#FF7070" : "#dcdce0;")};
    border-radius: 8px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;

    & > input {
      border: none;
      padding: 0 16px;
      border-radius: 8px;
      height: 100%;
      flex: 1;

      &::placeholder {
        font-weight: 400;
        font-size: 16px;
        line-height: 140%;
        color: #959599;
      }
    }
  `,

  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,

  LoginButton: styled.button`
    width: 452px;
    height: 50px;
    background-color: ${({ disabled }) => (disabled ? "#eee" : "#ff812e")};
    color: ${({ disabled }) => (disabled ? "#959599" : "#fff")};
    border-radius: 8px;
    margin: 0 auto;
    font-weight: 700;
    font-size: 16px;
    line-height: 22.4px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  `,

  RegisterButton: styled.button`
    margin: 20px;
    width: 56px;
    border-bottom: 1px solid #49494d;
    color: #49494d;
    font-weight: 800;
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
  `,
};
