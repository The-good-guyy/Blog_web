import { Table } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getAllUsersRoutes, countAllUsersRoutes } from '../../utils/ApiRoutes';
import { Pagination } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function DashUsers() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const { currentUser } = useSelector((state) => state.user.user);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState({
    totalPosts: 1,
    totalPages: 1,
  });
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
        getAllUsersRoutes + `?limit=${limitPage.current}&page=${page}`,
        { withCredentials: true }
      );
      if (data.status === 200) {
        setUsers(data.data.data.data);
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
        const pages = await axios.get(countAllUsersRoutes, {
          withCredentials: true,
        });
        const data = await axios.get(
          getAllUsersRoutes + `?limit=${limitPage.current}&fields=-content`,
          { withCredentials: true }
        );
        if (data.status === 200) {
          setUsers(data.data.data.data);
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
  }, [currentUser.role]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.role === 'admin' && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Twitter</Table.HeadCell>
              <Table.HeadCell>Github</Table.HeadCell>
              <Table.HeadCell>Linkedin</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{capitalizeFirstLetter(user.role)}</Table.Cell>
                  <Table.Cell>
                    {user.twitterURL === 'https://twitter.com/example'
                      ? 'None'
                      : user.twitterURL}
                  </Table.Cell>
                  <Table.Cell>
                    {user.githubURL === 'https://github.com/example'
                      ? 'None'
                      : user.githubURL}
                  </Table.Cell>
                  <Table.Cell>
                    {user.linkedinURL === 'https://linkedin.com/example'
                      ? 'None'
                      : user.linkedinURL}
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
        <p>You have no users yet!</p>
      )}
      <ToastContainer />
    </div>
  );
}
