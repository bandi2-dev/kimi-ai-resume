import { authRouter } from "./auth-router";
import { resumeRouter } from "./routers/resume";
import { templateRouter } from "./routers/template";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  resume: resumeRouter,
  template: templateRouter,
});

export type AppRouter = typeof appRouter;
