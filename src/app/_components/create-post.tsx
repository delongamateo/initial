"use client";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { useTheme } from "next-themes";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { setTheme } = useTheme();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      let response;
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

      const data = await response.json();
      return data;
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        setTheme("dark");
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
      <Button type="submit" variant="secondary" disabled={createPost.isLoading}>
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
