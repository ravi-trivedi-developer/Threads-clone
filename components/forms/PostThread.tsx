"use client";

import React, { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidations } from "@/lib/validations/thread";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.action";

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof ThreadValidations>>({
    resolver: zodResolver(ThreadValidations),
    defaultValues: {
      thread: "",
      accountId: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidations>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
    // console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
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
            Post Thread
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PostThread;
