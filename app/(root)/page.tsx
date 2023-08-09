import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  if (!user) return null; // to avoid TS error

  return (
    <>
      <h1 className="head-text">Home</h1>
      {result.postQuery.length === 0 ? (
        <p className="no-result">No threads found</p>
      ) : (
        result.postQuery.map((post) => (
          <ThreadCard
            key={post._id}
            id={post._id}
            currentUserId={user?.id}
            parentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.comments}
          />
        ))
      )}
    </>
  );
}
