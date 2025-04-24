"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocalStorage } from "@/hooks/useStorage";
import { decryptKey, encryptKey } from "@/lib/utils";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();

  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [accessKey, setAccessKey, removeAccessKey] = useLocalStorage(
    "accessKey",
    ""
  );

  const encryptedKey = typeof window !== "undefined" ? accessKey : null;

  useEffect(() => {
    const key = encryptedKey && decryptKey(encryptedKey);

    if (path) {
      if (key === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      setAccessKey(encryptedKey);

      setOpen(false);
    } else {
      setPasskeyError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/icons/close.svg"
              width={20}
              height={20}
              alt="close"
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
            <div className="mt-6">
              <InputOTP
                maxLength={6}
                value={passkey}
                onChange={(value) => setPasskey(value)}
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
