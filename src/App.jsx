import { useState } from "react";

export default function App() {

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [feedback, setFeedback] = useState("");

  const GOOGLE_REVIEW_LINK =
    "https://search.google.com/local/writereview?placeid=ChIJF42NmvBmBzsRuhPykAmZyEE";

  async function generateReview() {
    setLoading(true);
    setApiFailed(false);
    setReview("");
    setCopied(false);

    try {
      const response = await fetch("/api/generateReviews");

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.reviews || !data.reviews[0]) {
        throw new Error("Invalid API response");
      }

      setReview(data.reviews[0]);

    } catch (err) {
      console.error("Review generation failed:", err);
      setApiFailed(true);
    }

    setLoading(false);
  }

  function handleRating(stars) {
    setRating(stars);
    setReview("");
    setApiFailed(false);
    setCopied(false);

    if (stars >= 4) {
      generateReview();
    }
  }

  function copyReview() {
    if (!review) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(review).catch(() => {});
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = review;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
  }

  return (
    <div className="min-h-screen bg-[#f1f3f4] flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">

        {/* BUSINESS HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/logo.jpeg"
            className="w-14 h-14 rounded-full object-cover"
            alt="Mist Cottage Logo"
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
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`text-5xl transition-transform hover:scale-125 ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* POSITIVE FLOW */}
        {rating >= 4 && (
          <div>
            <h3 className="font-medium mb-3">Your review suggestion</h3>

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                <span className="text-sm ml-2">Generating AI review...</span>
              </div>
            )}

            {/* Review card + two-step buttons */}
            {review && !loading && (
              <div className="mb-3">

                {/* Review text */}
                <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-3">
                  <p className="text-gray-800">{review}</p>
                </div>

                {/* Step 1: Copy button */}
                <button
                  onClick={copyReview}
                  className={`w-full py-2 rounded-lg transition font-medium mb-2 ${
                    copied
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {copied ? "✓ Review Copied!" : "📋 Step 1: Copy Review"}
                </button>

                {/* Step 2: Google link — plain <a> tag, no JS, no popup risk */}
                <a
                  href={GOOGLE_REVIEW_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-2 rounded-lg font-medium text-center transition ${
                    copied
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  ⭐ Step 2: Post on Google Reviews
                </a>

                {copied && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Open Google Reviews above → paste → submit!
                  </p>
                )}

              </div>
            )}

            {/* API Failed */}
            {apiFailed && !loading && (
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500 mb-3">
                  Couldn't generate a suggestion right now. You can write your own review directly on Google!
                </p>
                <a
                  href={GOOGLE_REVIEW_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center"
                >
                  Write My Own Google Review →
                </a>
              </div>
            )}

            {!apiFailed && !loading && !copied && review && (
              <p className="text-xs text-gray-400 mt-1 text-center">
                ⭐ Takes less than 10 seconds
              </p>
            )}
          </div>
        )}

        {/* NEGATIVE FLOW */}
        {rating > 0 && rating < 4 && (
          <div>
            <h3 className="font-medium mb-3">We value your feedback</h3>
            <textarea
              placeholder="Tell us how we can improve..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border rounded-lg p-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <button
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
              onClick={() => alert("Thank you for your feedback!")}
            >
              Submit Feedback
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
