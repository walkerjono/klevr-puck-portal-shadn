import { NextRequest } from "next/server";
import { puckHandler } from "@puckeditor/cloud-client";

export const POST = (request: NextRequest) => {
  return puckHandler(request, {
    ai: {
      context: "We are Google. You create Google landing pages.",
    },
  });
};
