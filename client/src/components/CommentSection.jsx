import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaRegComment } from 'react-icons/fa';
import {
  getAllCommentRoutes,
  createCommentRoutes,
  likeCommentRoutes,
  deleteCommentRoutes,
  likePostRoutes,
} from '../../utils/ApiRoutes';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function CommentSection({ postId, post, setPost }) {
  const { currentUser } = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };
  const handlePostLike = async (postId) => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const data = await axios.put(
        likePostRoutes + `/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.status === 200) {
        setPost(data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastOptions);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      setLoading(true);
      const data = await axios.post(
        createCommentRoutes + `/${postId}`,
        { content: comment },
        { withCredentials: true }
      );
      setLoading(false);
      console.log(data);
      if (data.status === 201) {
        const commentContent = data.data;
        setComment('');
        setCommentError(null);
        setComments((prevState) => {
          return [commentContent, ...prevState];
        });
      }
    } catch (error) {
      setLoading(false);
      setCommentError(error.response.data.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await axios.get(getAllCommentRoutes + `?postId=${postId}`);
        if (data.status === 200) {
          console.log(data.data.data.data);
          setComments(data.data.data.data);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const data = await axios.put(
        likeCommentRoutes + `/${commentId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.status === 200) {
        setComments((prevState) =>
          prevState.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.data.likes,
                  numberOfLikes: data.data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      toast.error(error.response.data.message, toastOptions);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const data = await axios.delete(deleteCommentRoutes + `/${commentId}`, {
        withCredentials: true,
      });
      if (data.status === 200) {
        setComments((prevState) =>
          prevState.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      toast.error(error.response.data.message, toastOptions);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      <div className="text-sm my-5 flex items-center gap-1">
        <button onClick={() => handlePostLike(postId)} className="-ml-8">
          <div
            className={`heart ${
              currentUser && post.likes.includes(currentUser._id) && 'is-active'
            }`}
          ></div>
          {/* <PiHandsClapping className="text-lg" /> */}
        </button>
        <div className="py-1 px-2 rounded-sm text-lg -ml-8">
          <p>{post.numberOfLikes || 0}</p>
        </div>
        <FaRegComment className="text-2xl" />
        <div className="py-1 px-2 rounded-sm text-lg">
          <p>{comments.length || 0}</p>
        </div>
      </div>
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={'/login'}>
            Log in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleCommentSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
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
