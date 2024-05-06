import { Link } from "react-router-dom";
function VaporWaveCard({ post }) {
  return (
    <Link to={`/post/${post._id}`}>
      <div className="vaporWaveCard md:w-[400px] w-full mx-5 my-4 shadow-[5px_5px_0px_0px_rgba(240,46,170,0.5)] hover:shadow-[rgba(240,46,170,0.4)_5px_5px,rgba(240,46,170,0.3)_10px_10px,rgba(240,46,170,0.2)_15px_15px,rgba(240,46,170,0.1)_20px_20px,rgba(240,46,170,0.05)_25px_25px] transition-all max-w-80  XXsm:max-w-lg sm:w-[440px]">
        <header
          className={`before:bg-[url('https://firebasestorage.googleapis.com/v0/b/mern-blog-project-28a14.appspot.com/o/blogImage%2F1712854714208efccb787?alt=media&token=78fe950a-2cf0-4b31-bea9-c1963a2d4874')] before:bg-center`}
        >
          <h2 className="mb-1">
            <span>{post.category.slice(0, 7)}</span>
            {/* {post.category.slice(8) && (
            <span className="line-clamp-1">{post.category.slice(7)}</span>
          )} */}
            {post.category.slice(8) ? (
              <span className="line-clamp-1">{post.category.slice(7)}</span>
            ) : (
              <span className="invisible">Useless</span>
            )}
          </h2>
          <div className="title">
            {" "}
            <span className="en">Category</span>
            <hr />
            <span className="jp">キャテゴリー</span>
          </div>
        </header>
        <div className="desc mb-4 h-24">
          <span className="line-clamp-2 text-lg font-semibold text-black">
            {post.title}
          </span>
        </div>
        {/* <footer>
        <div className="actions">
          <button>
            {" "}
            <svg viewBox="0 0 24 24">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
            </svg>
          </button>
          <button>
            {" "}
            <svg viewBox="0 0 24 24">
              <path d="M19,8L15,12H18A6,6 0 0,1 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20A8,8 0 0,0 20,12H23M6,12A6,6 0 0,1 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4A8,8 0 0,0 4,12H1L5,16L9,12"></path>
            </svg>
          </button>
          <button>
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
            </svg>
          </button>
        </div>
      </footer> */}
      </div>
    </Link>
  );
}

export default VaporWaveCard;
