import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Spinner,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firbase/firebase";
import { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { generateId } from "../../utils/Helper";
import { updatePostRoutes, getOnePostRoutes } from "../../utils/ApiRoutes";
import { AiOutlineClose } from "react-icons/ai";
import { quillModules } from "../../utils/Helper";
import { quillFormats } from "../../utils/Helper";
export default function UpdatePost() {
  const [imageFile, setImageFile] = useState({ file: null, ImageURL: null });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const FileInputValue = useRef();
  const formTitle = useRef();
  const { postId } = useParams();
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const data = await axios.get(getOnePostRoutes + `/${postId}`);
        if (data.status === "fail") {
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormData(data.data.data.data);
          formTitle.current.value = data.data.data.data.title;
          setImageFile({ file: null, ImageURL: data.data.data.data.image });
          // navigate(`/post/${data.slug}`);
        }
      };

      fetchPost();
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  }, [postId]);
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImageFile({ file, ImageURL: URL.createObjectURL(file) });
  };
  const uploadImage = async () => {
    try {
      if (!imageFile.file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = "blogImage/" + new Date().getTime() + generateId(8);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          toast.error("Image upload failed", toastOptions);
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(downloadURL);
          setFormData((prevState) => {
            return {
              ...prevState,
              title: formTitle.current.value,
              image:
                "https://firebasestorage.googleapis.com/v0/b/mern-blog-project-28a14.appspot.com/o/blogImage%2F1712854248680b4dcd25b?alt=media&token=5ee263ae-8056-42b1-b119-d29a5a77d7f1",
            };
          });
          setImageUploadProgress(null);
          setImageUploadProgress(null);
        }
      );
    } catch (error) {
      toast.error(error.message, toastOptions);
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploadProgress(true);
      setFormData((prevState) => {
        return { ...prevState, title: formTitle.current.value };
      });
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 200)
      );
      const data = await axios.put(updatePostRoutes + `/${postId}`, formData, {
        withCredentials: true,
      });
      setUploadProgress(null);
      if (data.status === "fail") {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        toast.success("Successfully update post", toastOptions);
        // navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setUploadProgress(true);
      setImageUploadProgress(false);
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update your post
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            disabled={uploadProgress}
            ref={formTitle}
          />
          <Select
            onChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, category: e.target.value };
              })
            }
            disabled={uploadProgress}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="none">None</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
            disabled={imageUploadProgress}
            ref={FileInputValue}
            helperText="APNG, AVIF, SVG, PNG, JPG or GIF."
          />
          <div className="flex gap-2 items-center">
            <Button
              color="dark"
              className="group focus:ring-transparentease-linear transition-colors h-full text-xs"
              onClick={uploadImage}
              disabled={imageUploadProgress}
            >
              Upload Image
            </Button>
            <Button
              color="dark"
              onClick={() => {
                setImageFile({ file: null, ImageURL: null }),
                  (FileInputValue.current.value = "");
              }}
              className="group focus:ring-transparentease-linear transition-colors h-full"
              disabled={imageUploadProgress}
            >
              <AiOutlineClose />
            </Button>
          </div>
        </div>
        {imageUploadError && (
          <Alert color="failure" onDismiss={() => setImageUploadError(null)}>
            {imageUploadError}
          </Alert>
        )}
        {imageFile.ImageURL && (
          <img
            src={imageFile.ImageURL}
            alt="upload"
            className="w-full h-full object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData((prevState) => {
              return { ...prevState, content: value };
            });
          }}
          disabled={uploadProgress}
          value={formData.content}
          modules={quillModules}
          formats={quillFormats}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          {uploadProgress ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {publishError && (
          <Alert
            className="mt-5"
            color="failure"
            onDismiss={() => setPublishError(null)}
          >
            {publishError}
          </Alert>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}
