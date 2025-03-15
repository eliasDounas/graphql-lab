import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GET_TAGS = gql`
  query GetTags {
    tags
  }
`;

const TagsList: React.FC = () => {
    const navigate  = useNavigate();
    const { loading, error, data } = useQuery<{ tags: string[] }>(GET_TAGS);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <Card className="w-full max-w-md mx-auto mt-32 border-gray-400 shadow-lg">
      <CardHeader>
        <CardTitle className="font-bold">Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {data?.tags.map((tag, index) => (
            <Badge key={index} variant="secondary"
            onClick={() => navigate(`${tag}`)}
            className="text-sm px-3 py-1 cursor-pointer bg-emerald-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagsList;
