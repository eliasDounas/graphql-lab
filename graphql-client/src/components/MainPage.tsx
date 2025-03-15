import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-200 w-screen h-screen">
      <Card className="w-full max-w-lg shadow-lg bg-white border border-gray-300 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-indigo-700">Welcome! 🌟</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Link to="/user">👥 Users List</Link>
            </Button>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Link to="/user/create">➕ Create User</Link>
            </Button>
            <Separator />
            <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Link to="/posts">📝 Post Feed</Link>
            </Button>
            <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              <Link to="/posts/create">📌 Create Post</Link>
            </Button>
            <Separator />
            <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Link to="/comments">💬 Comments</Link>
            </Button>
            <Separator />
            <Button asChild className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              <Link to="/tags">🏷️ Tags List</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
