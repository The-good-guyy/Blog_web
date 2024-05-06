import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import HomePagePostCard from '../components/HomePagePostCard';
import { getAllPostRoutes, get3PopularPostRoutes } from '../../utils/ApiRoutes';
import Type2PostCard from '../components/Type2PostCard';
import VaporWaveCard from '../components/VaporWaveCard';
import FollowCommunity from '../components/FollowCommunity';
import axios from 'axios';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await axios.get(getAllPostRoutes + `?limit=5`);
        console.log(data);
        if (data.status === 200) {
          setPosts(data.data.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPopularPosts = async () => {
      try {
        const data = await axios.get(get3PopularPostRoutes);
        if (data.status === 200) {
          setPopularPosts(data.data.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
    fetchPopularPosts();
  }, []);
  return (
    <div>
      {/* <div className="titleBody">
        <p class="spin">
          <span class="spin-group">
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
            <span class="spin-group-text">
              EXTREME
              <br />
              GRAPHICS
            </span>
          </span>
        </p>
      </div> */}
      {posts && posts.length > 4 && (
        <div className="md:grid md:grid-cols-7 max-w-7xl mx-auto flex flex-col mt-10">
          <div className="md:col-span-2 flex flex-col gap-4 md:mx-4 md:order-1 mx-5">
            <HomePagePostCard post={posts[0]} />
            <HomePagePostCard post={posts[1]} />
          </div>
          <div className="md:col-span-3 flex flex-col justify-center md:mx-4 order-first md:order-2 md:mb-20 mx-5 mb-0">
            <HomePagePostCard post={posts[2]} mainFeature="true" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 md:mx-4 md:order-3 mx-5">
            <HomePagePostCard post={posts[3]} />
            <HomePagePostCard post={posts[4]} />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <h2 className="text-2xl font-semibold text-center mt-8">Recent Posts</h2>
      {posts && posts.length > 0 && (
        <div className="max-w-6xl  p-3 flex flex-col gap-y-24 py-7 md:mx-auto mx-5">
          {posts.map((post) => (
            <Type2PostCard key={post._id} post={post} />
          ))}
          <Link
            to={'/search'}
            className="text-lg text-teal-500 hover:underline text-center"
          >
            View all posts
          </Link>
        </div>
      )}
      {posts && posts.length > 0 && (
        <div className="w-full bg-[#f7f7f7] flex flex-col mt-8 pb-20 dark:bg-[#1C1E21]">
          <h2 className="text-3xl font-semibold text-center mt-16">Popular</h2>
          <div className="flex mt-16 flex-wrap gap-8 justify-center">
            {popularPosts.map((post) => (
              <VaporWaveCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
      <FollowCommunity />
    </div>
  );
}
