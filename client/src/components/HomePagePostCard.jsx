import { Link } from "react-router-dom";
import { convert } from "html-to-text";
export default function HomePagePostCard({ post, mainFeature = false }) {
  return (
    <div className="group relative w-full overflow-hidden md:mb-0 mb-7 dark:hover:shadow-[rgba(240,46,170,0.4)_-5px_5px,rgba(240,46,170,0.3)_-10px_10px,rgba(240,46,170,0.2)_-15px_15px,rgba(240,46,170,0.1)_-20px_20px,rgba(240,46,170,0.05)_-25px_25px] hover:shadow-[rgba(220,220,220,0.4)_-5px_5px,rgba(220,220,220,0.3)_-10px_10px,rgba(220,220,220,0.2)_-15px_15px,rgba(220,220,220,0.1)_-20px_20px,rgba(220,220,220,0.05)_-25px_25px] transition-all">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.image}
          alt="post cover"
          className={`w-full object-cover z-20  ${
            mainFeature ? "h-[380px]" : "h-[260px]"
          }`}
        />
      </Link>
      <div
        className={`${
          mainFeature ? "top-[354px] " : "top-[234px] "
        } absolute right-2/4 top-[234px] translate-x-2/4 self-center block bg-white dark:bg-black px-4 py-2 border-2 border-black dark:border-white uppercase shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]`}
      >
        {post.category}
      </div>
      <Link to={`/post/${post._id}`}>
        <div className="p-3 flex flex-col gap-2 mt-8">
          <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
          <p className="text-sm font-normal line-clamp-3">
            {convert(post.content)}
          </p>
        </div>
      </Link>
    </div>
  );
}
