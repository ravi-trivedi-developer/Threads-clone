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
import { CommentValidations } from "@/lib/validations/thread";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";

type Props = {
  threadId: string;
  currUserImg: string;
  currUserId: string;
};

const Comment = ({ threadId, currUserImg, currUserId }: Props) => {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidations>>({
    resolver: zodResolver(CommentValidations),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidations>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currUserId),
      pathname
    );
    // console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-3">
                <FormLabel>
                  <Image
                    src={currUserImg}
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    {...field}
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
