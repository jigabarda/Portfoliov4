export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return new Response("Missing GitHub token", { status: 500 });
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.user) {
      return new Response("GitHub API error", { status: 500 });
    }

    return new Response(
      JSON.stringify(
        data.data.user.contributionsCollection.contributionCalendar
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}
