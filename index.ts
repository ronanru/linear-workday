#!/usr/bin/env -S bun run
import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({ apiKey: Bun.env.LINEAR_API_KEY });

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const myIssues = await linearClient.issues({
  filter: {
    assignee: {
      isMe: {
        eq: true,
      },
    },
    or: [
      {
        completedAt: {
          gte: todayStart,
        },
      },
      {
        and: [
          {
            startedAt: {
              null: false,
            },
          },
          {
            completedAt: {
              null: true,
            },
          },
          {
            canceledAt: {
              null: true,
            },
          },
        ],
      },
    ],
  },
});

const issues = myIssues.nodes.map((issue) => issue.identifier).join(" ");

Bun.spawnSync(["wl-copy", issues]);
console.log(issues);
