"use client";

import React, { ChangeEvent, useState } from "react";
import { UserValidations } from "@/lib/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
};

const AccountProfile = ({ user, btnTitle }: Props) => {
  console.log(
    "🚀 ~ file: AccountProfile.tsx:35 ~ AccountProfile ~ user:",
    user
  );

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const pathname = usePathname()
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserValidations>>({
    resolver: zodResolver(UserValidations),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof UserValidations>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const blob = values.profile_photo;

    // Base64 is a method of encoding binary data as ASCII text.
    // This is necessary for sending files via Internet email,
    // which can only handle 7-bit ASCII text.
    // Base64 is the industry standard format for SSL certificate content
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      console.log("~ imgRes: ---", imgRes);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    await updateUser(
      values.name,
      values.username,
      values.bio,
      values.profile_photo,
      user.id,
      pathname
      );

    console.log(values);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    console.log("fileReader:", fileReader);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      console.log("file ---", file);
      console.log("Array.from(e.target.files) ---", Array.from(e.target.files));

      setFiles(Array.from(e.target.files));

      // GENERATE IMAGE URL USING FILE LOADER AND SET TO fieldChange
      fileReader.onload = async (event) => {
        console.log("fileReader.onload= ~ event: ----", event);
        debugger;
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      //readAsDataURL :- this method is used to read the contents of the specified File
      fileReader.readAsDataURL(file);

      if (!file.type.includes("image")) return;
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="profile_icon"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile_icon"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Add profile photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            {btnTitle}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountProfile;
