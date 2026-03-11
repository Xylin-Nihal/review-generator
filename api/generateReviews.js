export default async function handler(req, res) {

try {

const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${process.env.OPENROUTER_KEY}`
},
body:JSON.stringify({
model:"meta-llama/llama-3-8b-instruct",
messages:[
{
role:"user",
content:`
Generate 3 unique and natural sounding positive Google review comments for a homestay called "Mist Cottage and Home Stay" located in Kodaikanal.

Requirements:
• Each review must contain between 15 and 30 words.
• Each review must include 2 or 3 different keywords from the list below.
• Rotate the keywords so each review uses a different combination.
• Do not repeat the same keyword combination.
• The keywords must appear naturally in the sentence.
• Do not number the reviews.
• Return each review on a new line.
  do not include any additional text or formatting, only the review comments.

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
temperature:1
})
}
)

const data = await response.json()

const text = data.choices[0].message.content

const list = text
.split("\n")
.map(r => r.replace(/^\d+[\).\-\s]*/, "").trim())
.filter(Boolean)

res.status(200).json({reviews:list})

} catch(err){

console.error(err)

res.status(500).json({
reviews:[
"Beautiful and peaceful Kodaikanal home stay with friendly hosts. One of the best cottages in Kodaikanal for a relaxing family stay in Kodaikanal.",
"Very comfortable and clean property. This cottage in Kodaikanal easily stands out among the best homestay in Kodaikanal and budget hotels in Kodaikanal.",
"Amazing hospitality and calm surroundings. Definitely one of the best hotels in Kodaikanal and perfect for a group stay in Kodaikanal."
]
})

}

}