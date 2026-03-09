import { useState } from "react";

export default function App() {

const [rating,setRating] = useState(0)
const [reviews,setReviews] = useState([])
const [loading,setLoading] = useState(false)
const [feedback,setFeedback] = useState("")

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
content:"Generate 3 short positive Google review comments for a cottage stay in kodaikanalunder 15 words. Each on a new line. Do not say anything else other than the review comments."
}
],
temperature:0.9
})
}
)

const data = await response.json()

const text = data.choices[0].message.content

const list = text
.split("\n")
.map(r => r.replace(/^\d+[\).\-\s]*/, "").trim())
.filter(Boolean)

setReviews(list)

}catch(err){

console.log(err)

setReviews([
"Great hospitality and peaceful stay!",
"Beautiful property with excellent service!",
"Wonderful experience, highly recommended!"
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

alert("✅ Review copied! Paste it on Google Review.")

}

return (

<div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center p-4">

<div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">

{/* BUSINESS HEADER */}

<div className="flex items-center gap-4 mb-6">

<img
src="/logo.jpeg"
className="w-14 h-14 rounded-full object-cover"
/>

<div>

<h2 className="font-semibold text-lg">
MIST COTTAGE AND HOME STAY
</h2>

<p className="text-sm text-gray-500">
Leave a review about your experience
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
Tap to copy
</p>

</div>

))}

<button
onClick={()=>window.open(GOOGLE_REVIEW_LINK)}
className="mt-4 w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition"
>

Write Review on Google

</button>

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