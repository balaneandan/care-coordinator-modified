"use client";

import { loginUser, verifyOTP } from "@/actions/user.actions";
import DynamicFormField from "@/components/DynamicFormField";
import ErrorPanel from "@/components/ErrorPanel";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLocalStorage } from "@/hooks/useStorage";

import { SignInFormValidation } from "@/lib/validation";
import { ErrorMsg, VerifyOTP } from "@/types/api";
import { FormFieldType } from "@/types/enums";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const LoginForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [sessionToken, setSessionToken] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passkeyError, setPasskeyError] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInFormValidation>>({
    resolver: zodResolver(SignInFormValidation),
    defaultValues: formData,
  });

  const onSubmit = async (formValues: z.infer<typeof SignInFormValidation>) => {
    setIsLoading(true);
    setError(null);
    const { user, userError } = await loginUser(formValues);

    if (user) {
      setChallengeId(user.challengeId);
      setSessionToken(user.session_token);
      setStep(2);
    } else {
      setError({ message: userError } as ErrorMsg);
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);

    const response = await verifyOTP({ challengeId: challengeId, session_token: sessionToken, otp: otp } as VerifyOTP);
    setIsLoading(false);

    if (response.msg.access_token) {
      localStorage.setItem("access_token", response.msg.access_token);

      // router.push(`/patients/${response.msg.userId}/new-appointment?patientId=${"681a2dce00286427156b"}`);
      router.push(`/dashboard/${response.msg.userId}`);
    } else {
      setError({
        message: response.error
      } as ErrorMsg);
    }
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <section className="mb-12 space-y-4">
            <h1 className="header">Sign in</h1>
            <p className="text-dark-700">Sign in and schedule appointments.</p>
          </section>

          {step === 1 && (
            <>
              <DynamicFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder=""
                iconSrc="/icons/user.svg"
                iconAlt="user"
              />

              <DynamicFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="Password"
                placeholder=""
                iconSrc="/icons/lock.svg"
                iconAlt="lock"
              />

              <SubmitButton isLoading={isLoading}>Next</SubmitButton>
            </>
          )}

          {error && <ErrorPanel error={error} />}
        </form>
      </Form>
      {step === 2 && (
        <>
          <div className="mt-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="shad-otp">
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={0}
                  />
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={1}
                  />
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={2}
                  />
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={3}
                  />
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={4}
                  />
                  <InputOTPSlot
                    className="shad-otp-slot text-36-bold"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>

              {passkeyError && (
                <p className="shad-error text-14-regular mt-4 flex justify-center">
                  {passkeyError}
                </p>
              )}
            </div>
            <br/>
          <Button
            type="button"
            onClick={handleOtpSubmit}
            className={"shad-primary-btn w-full"}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <br/>
        </>
      )}
    </>
  );
};