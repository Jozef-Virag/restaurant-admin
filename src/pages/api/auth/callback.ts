import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return new Response("Missing code", { status: 400 });
    }

    // Vymeníme code za access_token
    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }),
    });

    const data = await res.json();

    if (data.error) {
        return new Response(JSON.stringify(data), { status: 400 });
    }

    // access_token -> vráť HTML stránku pre Decap CMS
    const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
      window.opener.postMessage({ token: "${data.access_token}", provider: "github" }, window.location.origin);
      window.close();
    </script>
  </body>
</html>`;
    return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
    });
};
