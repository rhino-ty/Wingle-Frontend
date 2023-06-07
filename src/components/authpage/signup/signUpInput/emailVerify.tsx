import { signUpFormDataAtom } from "@/src/atoms/auth/signUpAtoms";
import { Margin } from "@/src/components/ui";
import { ChangeEvent, useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  sendEmailAuth,
  verifyEmailCertification,
} from "@/src/api/auth/emailAPI";
import { useMutation } from "react-query";
import TextInputWithButton from "@/src/components/ui/textInputWithButton";
import { EmailAuthResponse } from "@/src/types/auth/emailApiType";
import { SignUpFormData } from "@/src/types/auth/signupFormDataType";

export default function EmailVerify(): JSX.Element {
  const [buttonMessage, setButtonMessage] = useState("인증 전송");
  const [emailMent, setEmailMent] = useState("");
  const [emailCertificationMent, setEmailCertificationMent] = useState("");

  const [email, setEmail] = useState("");
  const [emailCertification, setEmailCertification] = useState("");

  const setSignUpFormData = useSetRecoilState(signUpFormDataAtom);

  const [isErrorEmail, setErrorEmail] = useState(false);
  const [isDisabledEmailButton, setDisabledEmailButton] = useState(true);

  const [isErrorEmailCertify, setErrorEmailCertify] = useState(false);
  const [isDisabledEmailCertifyButton, setDisabledEmailCertifyButton] =
    useState(true);

  const handleEmailInputData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value),
    []
  );
  const handleEmailertificationInputData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void =>
      setEmailCertification(e.target.value),
    []
  );

  // 이메일 유효성 검사
  const handleErrorEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const emailRegex = /^[A-Za-z0-9]+@[^\s@]+\.[^\s@]+$/; // 영어와 숫자만 사용 가능한 정규식
      const value = e.target.value;

      if (!emailRegex.test(value) || !(value.length >= 5)) {
        setErrorEmail(true);
        setDisabledEmailButton(true);
        setEmailMent("입력 형식에 맞지 않습니다.");
      } else {
        setErrorEmail(false);
        setDisabledEmailButton(false);
        setEmailMent("");
      }
    },
    []
  );

  // 이메일 인증번호 유효성 검사
  const handleErrorEmailCertify = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const emailRegex = /^\d+$/;
      const value = e.target.value;

      if (!emailRegex.test(value) || !(value.length >= 4)) {
        setDisabledEmailCertifyButton(true);
      } else {
        setDisabledEmailCertifyButton(false);
      }
    },
    []
  );

  // 이메일 인증메일 보내기
  const { mutate: sendEmail } = useMutation(
    (): Promise<EmailAuthResponse> => sendEmailAuth(email),
    {
      onMutate: (): void => {
        setButtonMessage("전송 중");
      },
      onSuccess: (): void => {
        setButtonMessage("재전송");
        setEmailMent("인증메일을 전송했습니다.");
      },
      onError: (error: unknown): never => {
        setErrorEmailCertify(true);
        alert(error);
        throw error;
      },
    }
  );

  const handleSendEmail = useCallback((): void => {
    if (email === "") {
      alert("이메일을 입력해주세요.");
      return;
    }
    sendEmail();
  }, [email, sendEmail]);

  // 이메일 인증번호 확인
  const { mutate: verifyEmail } = useMutation(
    (): Promise<boolean> =>
      verifyEmailCertification({ email, emailCertification }),
    {
      onSuccess: (): void => {
        setErrorEmailCertify(false);
        setSignUpFormData(
          (prev: SignUpFormData): SignUpFormData => ({
            ...prev,
            email,
          })
        );
        setEmailCertificationMent("인증번호가 일치합니다.");
      },
      onError: (error: unknown): never => {
        setErrorEmailCertify(true);
        throw error;
      },
    }
  );

  const handleVerifyEmail = useCallback((): void => {
    if (email === "") {
      alert("이메일을 입력해주세요.");
      return;
    }
    verifyEmail();
  }, [email, verifyEmail]);

  return (
    <>
      <TextInputWithButton
        label="이메일"
        name="이메일"
        placeholder="abc@naver.com"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
          handleEmailInputData(e);
          handleErrorEmail(e);
        }}
        error={isErrorEmail}
        errorMessage={emailMent}
        buttonMessage={buttonMessage}
        buttonDisabled={isDisabledEmailButton}
        onClick={handleSendEmail}
        description={emailMent}
      />
      <Margin direction="column" size={24} />

      <TextInputWithButton
        label="이메일 인증"
        name="이메일 인증"
        placeholder="인증번호"
        value={emailCertification}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
          handleEmailertificationInputData(e);
          handleErrorEmailCertify(e);
        }}
        error={isErrorEmailCertify}
        errorMessage="인증번호가 일치하지 않습니다."
        buttonMessage="인증 확인"
        buttonDisabled={isDisabledEmailCertifyButton}
        onClick={handleVerifyEmail}
        description={emailCertificationMent}
      />
      <Margin direction="column" size={24} />
    </>
  );
}
