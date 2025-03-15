import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Post from "./Post";

const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($tag: String!, $page: Int, $limit: Int, $orderBy: String) {
    postsByTag(tag: $tag, page: $page, limit: $limit, orderBy: $orderBy) {
      data {
        id
        text
        image
        likes
        tags
        publishDate
        owner {
          id
          title
          firstName
          lastName
          picture
        }
      }
    }
  }
`;

const PostsByTag: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  
  const { data, loading, error, refetch } = useQuery(GET_POSTS_BY_TAG, {
    variables: { tag, page: 1, limit: 10, orderBy: "asc" },
  });

  const handleDelete = async (id: string) => {
    alert(`Post ${id} deleted`);
    await refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts.</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 border-none">
      <CardHeader>
        <CardTitle>Posts tagged: {tag}</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        {data?.postsByTag.data.length ? (
          data.postsByTag.data.map((post: any) => <Post key={post.id} post={post} onDelete={handleDelete}/>)
        ) : (
          <div>No posts found for this tag.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostsByTag;
