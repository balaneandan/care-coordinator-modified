"use client";

import PasskeyModal from "@/components/PasskeyModal";
import { LoginForm } from "@/forms/LoginForm";
import UserForm from "@/forms/UserForm";
import FormLayout from "@/layouts/Form";
import { DisplayImg, Logo } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true" ? true : false;
  const [showLogin, setShowLogin] = useState<boolean>(true);
  return (
    <main className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
          <FormLayout
            containerStyles="max-w-[496px] my-auto"
            logo={Logo}
            displayImg={DisplayImg}
            showAdmin
          >
            {showLogin ?
              <>
                <LoginForm />
                <button onClick={() => { setShowLogin(false) }}>Create an account</button>
              </>
              :
              <UserForm />
            }
          </FormLayout>
    </main >
  );
}
