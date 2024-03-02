import { createReactClient, studioProvider } from "@livepeer/react";

export const client = createReactClient({
  provider: studioProvider({ apiKey:process.env.LIVEPEER_KEY }),
});
