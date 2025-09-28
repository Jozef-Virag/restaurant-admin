import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
    const redirectUri = process.env.OAUTH_CALLBACK_URL!;
    const clientId = process.env.GITHUB_CLIENT_ID!;
    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=repo,user`;

    return new Response(null, {
        status: 302,
        headers: {
            Location: authorizeUrl,
        },
    });
};
