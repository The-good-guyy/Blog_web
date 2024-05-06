import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import PostAuthor from "../components/PostAuthor";
import {
  getOnePostRoutes,
  getAllPostRoutes,
  getOneUsersRoutes,
} from "../../utils/ApiRoutes";
import axios from "axios";
import CommentSection from "../components/CommentSection";
export default function PostPage() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [postLike, setPostLike] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await axios.get(getOnePostRoutes + `/${postId}`);
        if (data.status === "fail") {
          setError(true);
          setLoading(false);
          return;
        } else {
          setPost(data.data.data.data);
          const user = await axios.get(
            getOneUsersRoutes + `/${data.data.data.data.userId}`
          );
          setUser(user.data.data.data);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const data = await axios.get(
          getAllPostRoutes + `?limit=3&fields=-content`
        );
        if (data.status === 200) {
          setRecentPosts(data.data.data.data);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-8xl mx-auto min-h-screen">
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center my-8"
      >
        {/* <Button color="gray" pill size="xs">
          {post && post.category}
        </Button> */}
        <div className="block bg-white dark:bg-black px-4 py-2 border-2 border-black dark:border-white uppercase shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
          {post && post.category}
        </div>
      </Link>
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-3xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <div className="flex max-w-3xl items-center mt-8 justify-between w-full mx-auto">
        {post && <PostAuthor user={user} />}
        {post && (
          <div className="invisible">
            <PostAuthor user={user} />
          </div>
        )}
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 w-full object-cover max-w-4xl mx-auto"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-3xl text-base">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 300 + 1).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-3xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full my-8">
        <CallToAction />
      </div>
      <CommentSection postId={postId} post={post} setPost={setPost} />
      <div className="inline-flex items-center justify-center w-full my-8">
        <hr className="w-64 h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40.945"
          height="33.341"
          viewBox="0 0 40.945 33.341"
        >
          <g data-name="Group 178" transform="translate(-184.827 -126.383)">
            <path
              data-name="Path 153"
              d="M201.724,131.458l-16.031,27.766h32.061Z"
              fill="#fff"
              stroke="#1a1818"
              strokeMiterlimit="10"
              strokeWidth="1"
            ></path>
            <path
              data-name="Path 154"
              d="M208.875,127.383l-16.031,27.766h32.061Z"
              fill="#1a1818"
              stroke="#1a1818"
              strokeMiterlimit="10"
              strokeWidth="1"
            ></path>
          </g>
        </svg>

        <h1 className="text-3xl mt-4">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-8 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
