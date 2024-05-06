import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { set } from "mongoose";
import axios from 'axios';
import {
  getAllPostRoutes,
  countAllPostRoutes,
  deletePostRoutes,
} from '../../utils/ApiRoutes';
import { Pagination } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PiWarningCircleBold } from 'react-icons/pi';
export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user.user);
  const [userPosts, setUserPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState({
    totalPosts: 1,
    totalPages: 1,
  });
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete, setPostIdtoDelete] = useState(null);
  const limitPage = useRef(10);
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };
  const onPageChange = async (page) => {
    try {
      const data = await axios.get(
        getAllPostRoutes +
          `?userId=${currentUser._id}&limit=${limitPage.current}&page=${page}&fields=-content`,
        { withCredentials: true }
      );
      if (data.status === 200) {
        setUserPosts(data.data.data.data);
      }
      setCurrentPage(page);
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const pages = await axios.get(
          countAllPostRoutes + `?userId=${currentUser._id}`,
          { withCredentials: true }
        );
        const data = await axios.get(
          getAllPostRoutes +
            `?userId=${currentUser._id}&limit=${limitPage.current}&fields=-content`,
          { withCredentials: true }
        );
        if (data.status === 200) {
          setUserPosts(data.data.data.data);
          setTotalPages({
            totalPosts: pages.data.data.data,
            totalPages: Math.ceil(pages.data.data.data / limitPage.current),
          });
        }
      } catch (error) {
        toast.error(error.message, toastOptions);
      }
    };
    if (currentUser.role === 'admin') {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.role]);

  const handleDeletePost = async () => {
    setOpenModal(false);
    try {
      const response = await axios.delete(
        deletePostRoutes + `/${postIdToDelete}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 204) {
        if (totalPages.totalPosts % totalPages.totalPages === 1) {
          setCurrentPage((prevState) => prevState - 1);
        }
        setTotalPages((prevState) => {
          return {
            totalPosts: prevState.totalPosts - 1,
            totalPages: Math.ceil(
              (prevState.totalPosts - 1) / limitPage.current
            ),
          };
        });
        const data = await axios.get(
          getAllPostRoutes +
            `?userId=${currentUser._id}&limit=${limitPage.current}&page=${currentPage}&fields=-content`,
          { withCredentials: true }
        );
        setPostIdtoDelete(null);
        setUserPosts(data.data.data.data);
        toast.success('Successful delete post', toastOptions);
      }
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.role === 'admin' && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="min-w-32 max-w-sm">
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className=" w-auto object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="sm:text-xs md:text-medium lg:text-lg text-gray-900 dark:text-white"
                      to={`/post/${post._id}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setOpenModal(true), setPostIdtoDelete(post._id);
                    }}
                  >
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <div className="flex overflow-x-auto sm:justify-center my-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages.totalPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={openModal}
        size="md"
        onClose={() => {
          setOpenModal(false), setPostIdtoDelete(null);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
            <PiWarningCircleBold className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeletePost()}>
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false), setPostIdtoDelete(null);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
