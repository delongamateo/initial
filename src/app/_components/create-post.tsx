"use client";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { useTheme } from "next-themes";
import { Session } from "next-auth";
import { Skeleton } from "~/components/ui/skeleton";

export function CreatePost({ session }: { session: Session | null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, []);

  const utils = api.useUtils();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      let response: Response;
      try {
        response = await fetch("/api/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        });
      } catch (err) {
        console.error(err);
        throw new Error("Failed to send message");
      }

      if (!response.ok) {
        console.error("Status code:", response.status);
        const responseBody = await response.text();
        console.error("Response body:", responseBody);
        throw new Error("Failed to send message");
      }

      /*  const data = await response.json(); */
      return "data";
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setName("");
      utils.post.invalidate();
    },
  });

  const {data: a} = api.post.getSecretMessage.useQuery()

  const { data, isLoading } = api.post.getPosts.useQuery();

  if (!session) {
    return (
      <div className="w-full text-center">
        <p className="text-2xl text-white">Sign in to create post {a}</p>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={createPost.isLoading}
        >
          {createPost.isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>

      <div className="mt-8">
        {isLoading ? (
          <Skeleton className="h-4 w-[250px]" />
        ) : (
          <p className="text-2xl text-white">{data?.name}</p>
        )}
      </div>
    </>
  );
}
