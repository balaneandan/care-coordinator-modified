"use client";

import PasskeyModal from "@/components/PasskeyModal";
import UserForm from "@/forms/UserForm";
import FormLayout from "@/layouts/Form";
import { DisplayImg, Logo } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true" ? true : false;

  return (
    <main className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <FormLayout
        containerStyles="max-w-[496px] my-auto"
        logo={Logo}
        displayImg={DisplayImg}
        showAdmin
      >
        <UserForm />
      </FormLayout>
    </main>
  );
}
