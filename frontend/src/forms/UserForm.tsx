"use client";

import { addUser } from "@/actions/user.actions";
import DynamicFormField from "@/components/DynamicFormField";
import ErrorPanel from "@/components/ErrorPanel";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";

import { UserFormValidation } from "@/lib/validation";
import { ErrorMsg } from "@/types/api";
import { FormFieldType } from "@/types/enums";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: formData,
  });

  const onSubmit = async (formValues: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    const { user, userError } = await addUser(formValues);

    if (user) {
      router.push(`/patients/${user.userID}/register`);
    } else {
      setFormData(formValues);
      setIsLoading(false);
      setError(userError);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Get Startedd</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

        <DynamicFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/icons/user.svg"
          iconAlt="user"
        />

        <DynamicFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@youremail.com"
          iconSrc="/icons/email.svg"
          iconAlt="email"
        />

        <DynamicFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>

        {error && <ErrorPanel error={error} />}
      </form>
    </Form>
  );
};

export default UserForm;
