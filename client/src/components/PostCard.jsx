import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-[#9D00FF] hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/post/${post._id}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="absolute right-2/4 top-[234px] group-hover:top-[174px] transition-all duration-300 translate-x-2/4 self-center block bg-white dark:bg-black px-4 py-2 border-2 border-black dark:border-white uppercase shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
        {post.category}
      </div>
      <div className="p-3 flex flex-col gap-2 mt-8">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        {/* <span className="italic text-sm">{post.category}</span> */}
        <Link
          to={`/post/${post._id}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-[#9D00FF] text-[#9D00FF] hover:bg-[linear-gradient(45deg,_#94d0ff,_#9D00FF)] hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
