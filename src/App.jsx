import { useState } from "react";

export default function App() {

const [rating,setRating] = useState(0)
const [reviews,setReviews] = useState([])
const [loading,setLoading] = useState(false)
const [feedback,setFeedback] = useState("")
const [copied,setCopied] = useState(false)

const GOOGLE_REVIEW_LINK =
"https://search.google.com/local/writereview?placeid=ChIJF42NmvBmBzsRuhPykAmZyEE"

async function generateReviews(){

setLoading(true)

try{

const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer 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"
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

console.log("API RESPONSE:", data)

if(!data.choices){
throw new Error("Invalid API response")
}

const text = data.choices[0].message.content

const list = text
.split("\n")
.map(r => r.replace(/^\d+[\).\-\s]*/, "").trim())
.filter(Boolean)

setReviews(list)

}catch(err){

console.error("Review generation failed:", err)

setReviews([
"Beautiful and peaceful Kodaikanal home stay with friendly hosts. One of the best cottages in Kodaikanal for a relaxing family stay in Kodaikanal.",
"Very clean and comfortable rooms. This cottage in Kodaikanal stands out among the best homestay in Kodaikanal and budget hotels in Kodaikanal.",
"Amazing hospitality and calm surroundings. Definitely one of the best hotels in Kodaikanal and perfect for a group stay in Kodaikanal."
])

}

setLoading(false)

}

function handleRating(stars){

setRating(stars)

if(stars >=4){
generateReviews()
}

}

function copyReview(text){

navigator.clipboard.writeText(text)

setCopied(true)

setTimeout(()=>{
window.open(GOOGLE_REVIEW_LINK,"_blank")
},1200)

}

return (

<div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center p-4">

<div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">

{/* BUSINESS HEADER */}

<div className="flex items-center gap-4 mb-4">

<img
src="/logo.jpeg"
className="w-14 h-14 rounded-full object-cover"
/>

<div>

<h2 className="font-semibold text-lg">
MIST COTTAGE AND HOME STAY
</h2>

<p className="text-sm text-gray-500">
Tap ⭐⭐⭐⭐⭐ to leave a quick Google review
</p>

</div>

</div>

{/* STAR RATING */}

<div className="flex justify-center mb-6">

{[1,2,3,4,5].map((star)=>(

<button
key={star}
onClick={()=>handleRating(star)}
className={`text-5xl transition-transform hover:scale-125 ${
star<=rating ? "text-yellow-400":"text-gray-300"
}`}
>

★

</button>

))}

</div>

{/* POSITIVE FLOW */}

{rating >=4 && (

<div>

<h3 className="font-medium mb-3">
Choose a review suggestion
</h3>

{copied && (
<div className="text-green-600 text-sm mb-3 text-center">
✓ Review copied! Opening Google review...
</div>
)}

{loading && (

<div className="flex items-center gap-2 text-gray-500 mb-4">

<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>

<span className="text-sm ml-2">
Generating AI reviews...
</span>

</div>

)}

{reviews.map((review,index)=>(

<div
key={index}
className="border rounded-xl p-4 mb-3 hover:bg-blue-50 cursor-pointer transition"
onClick={()=>copyReview(review)}
>

<p className="text-gray-800">{review}</p>

<p className="text-xs text-blue-600 mt-1">
Tap to copy & open Google review
</p>

</div>

))}

<p className="text-xs text-gray-400 mt-2 text-center">
⭐ Takes less than 10 seconds
</p>

</div>

)}

{/* NEGATIVE FLOW */}

{rating >0 && rating <4 && (

<div>

<h3 className="font-medium mb-3">
We value your feedback
</h3>

<textarea
placeholder="Tell us how we can improve..."
value={feedback}
onChange={(e)=>setFeedback(e.target.value)}
className="w-full border rounded-lg p-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
/>

<button
className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black"
onClick={()=>alert("Thank you for your feedback!")}
>

Submit Feedback

</button>

</div>

)}

</div>

</div>

)

}