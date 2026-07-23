export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "/api/chat",
      {
        method: "POST",
        headers: {
          "Authorization": Bearer ${process.env.OPENROUTER_API_KEY},
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return res.status(200).json({
        reply: data.choices[0].message.content
      });
    }

    return res.status(500).json({
      error: "AI response error",
      details: data
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
