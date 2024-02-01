import { openai } from "~/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
/*   const body = await req.json();
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            
      \n----------------\n

      
      
      USER INPUT:  ${body.message} \n`,
        },
      ],
    })

  return NextResponse.json({ response }); */

  return "response";
};
