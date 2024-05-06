import { Link } from "react-router-dom";
import { convert } from "html-to-text";
export default function Type2PostCard({ post }) {
  return (
    <div className="group relative w-full overflow-hidden flex flex-col md:flex-row">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.image}
          alt="post cover"
          className={`md:h-64 object-cover z-20 md:w-80 w-full`}
        />
      </Link>
      <div className="max-w-xl md:ml-5 flex flex-col justify-center relative mx-auto">
        <Link to={`/post/${post._id}`}>
          <div
            className={`inline-block relative md:top-0 -top-6 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 bg-white dark:bg-black px-4 py-2 border-2 border-black dark:border-white uppercase shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] transition-all`}
          >
            {post.category}
          </div>
        </Link>
        <Link to={`/post/${post._id}`}>
          <div className="flex flex-col gap-2 mt-8">
            <p className="text-xl font-semibold line-clamp-2 md:line-clamp-1">
              {post.title}
            </p>
            <p className="text-base font-normal line-clamp-2">
              {convert(post.content)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
