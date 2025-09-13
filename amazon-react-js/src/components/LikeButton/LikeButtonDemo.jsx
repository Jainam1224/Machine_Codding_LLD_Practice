import LikeButton from "./LikeButton";

export default function LikeButtonDemo() {
  const handleLikeChange = (isLiked, count) => {
    console.log(`Like status: ${isLiked}, Count: ${count}`);
  };

  return (
    <div>
      <h2>Like Button</h2>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        <LikeButton onLikeChange={handleLikeChange} />
      </div>
    </div>
  );
}
