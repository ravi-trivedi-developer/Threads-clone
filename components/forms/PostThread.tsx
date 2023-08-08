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

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(),
    defaultValues: {
      thread: "",
      accountId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidations>) => {
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

    await updateUser({
      userId: user.id,
      name: values.name,
      username: values.username,
      image: values.profile_photo,
      bio: values.bio,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }

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

      //   setFiles(Array.from(e.target.files));

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

  return <div></div>
};

export default PostThread;
