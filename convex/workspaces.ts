import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error(`Unauthorized`);
        }

        // TODO: Create a proper method for this
        const joinCode = '12345';

        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode
        });

        return workspaceId;
    },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error(`Unauthorized`);
        }

        const workspaces = await ctx.db.query("workspaces").collect();
        return workspaces;
    },
});