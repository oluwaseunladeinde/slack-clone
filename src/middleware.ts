import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

const isSPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
    if (!isSPublicPage(request) && !isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }

    if (isSPublicPage(request) && isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};