export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "user",
              content: `
Generate 1 unique and natural sounding positive Google review comment for a homestay called "Mist Cottage and Home Stay" located in Kodaikanal.

Requirements:
• The review must contain between 15 and 30 words.
• The review must include 2 or 3 different keywords from the list below.
• The keywords must appear naturally in the sentence.
• Do not number the review.
• Return only the review comment, no additional text or formatting.

Keywords:
1. Kodaikanal home stay
2. Best hotels in Kodaikanal
3. Budget hotels in Kodaikanal
4. Hotels in Kodaikanal
5. Group stay in Kodaikanal
6. Resorts in Kodaikanal
7. Best cottages in Kodaikanal
8. Cottage in Kodaikanal
9. Best homestay in Kodaikanal
10. Family stay in Kodaikanal

Focus on positive experiences like peaceful atmosphere, clean rooms, friendly hosts, relaxing stay and beautiful surroundings.
`
            }
          ],
          temperature: 1
        })
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();

    const text = data.choices[0].message.content.trim();

    res.status(200).json({ reviews: [text] });

  } catch (err) {

    console.error(err);

    // Return 500 — frontend will show "Write My Own Review" button instead of fake reviews
    res.status(500).json({ error: "Failed to generate review" });

  }

}