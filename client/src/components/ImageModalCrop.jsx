import { Modal, Button } from "flowbite-react";
import { HiComputerDesktop } from "react-icons/hi2";
import { FaCameraRetro } from "react-icons/fa";
import { useState, useRef, useCallback } from "react";
import EasyCrop from "./EasyCrop";
import avatar from "../assets/profilePicture2.png";
import WebcamCapture from "./ImageCamera";
import WaifuImg from "../assets/Waifu_img.jpg";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firbase/firebase";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { updateImage } from "../../redux/users/userSlice";
import axios from "axios";
import { updateUserRoutes } from "../../utils/ApiRoutes";
import { generateId } from "../../utils/Helper";
function ImageCropModal({ handleModal }) {
  const { currentUser } = useSelector((state) => state.user.user);
  const [imageFile, setImageFile] = useState({ file: null, ImageURL: null });
  const [useCamera, setUseCamera] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  // const uploadImage = async () => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + imageFile.file.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, imageFile.file);
  //   uploadTask.on("state_changed", (snapshot) => {
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     setImageFileUploadProgress(progress.toFixed(0));
  //   }),
  //     (error) => {
  //       setImageFileUploadError("Could not upload image");
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setImageFile((prevState) => {
  //           return { ...prevState, ImageURL: downloadURL };
  //         });
  //       });
  //     };
  // };
  const uploadImage = async (cropImage) => {
    function b64toBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/jpeg" });
    }
    const storage = getStorage(app);
    const fileName =
      "profileImg/" +
      currentUser._id +
      "/" +
      new Date().getTime() +
      generateId(5) +
      ".jpg";
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, b64toBlob(cropImage));
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image");
        setImageFileUploadProgress(null);
        setImageFile({ file: null, ImageURL: null });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          dispatch(updateImage(downloadURL));
          axios.put(
            updateUserRoutes,
            {
              profilePicture: downloadURL,
            },
            { withCredentials: true }
          );
        });
        setImageFile({ file: null, ImageURL: null });
        setUseCamera(false);
        setCroppedImage(null);
        handleModal(0);
      }
    );
  };
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setImageFile({
        file: acceptedFiles[0],
        ImageURL: URL.createObjectURL(acceptedFiles[0]),
      });
    }
  }, []);
  const { getRootProps } = useDropzone({
    noClick: true,
    onDrop,
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile({ file, ImageURL: URL.createObjectURL(file) });
    }
  };
  const resetImageFile = () => {
    filePickerRef.current.value = "";
    setImageFile({ file: null, ImageURL: null });
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={filePickerRef}
        hidden
      />
      <Modal show onClose={() => handleModal(0)} size="3xl" dismissible>
        <Modal.Header>
          {croppedImage ? "Your new profile picture" : "Change profile picture"}
        </Modal.Header>
        <Modal.Body>
          {!imageFile.file && !useCamera && (
            <div className="space-y-8 flex flex-col">
              <div {...getRootProps()}>
                <div className="flex justify-center mt-4">
                  <img
                    src={avatar}
                    alt="user"
                    className="rounded-full w-1/4 h-1/4"
                  ></img>
                </div>
                <h2 className="text-center mt-4">Drag photo here</h2>
              </div>
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-gray-200"></div>
                <span className="px-3 text-gray-500 bg-white">Or</span>
                <div className="flex-1 border-t-2 border-gray-200"></div>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  color="light"
                  onClick={() => filePickerRef.current.click()}
                  className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
                  size="xs"
                >
                  <span className="invisible">R</span>
                  <HiComputerDesktop className="mr-2 text-blue-700 group-hover:text-blue-800 text-base/6" />
                  <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
                    Upload your image
                  </span>
                  <span className="invisible">R</span>
                </Button>
                <Button
                  color="light"
                  onClick={() => setUseCamera(true)}
                  className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
                  size="xs"
                >
                  <span className="invisible">Rem</span>
                  <FaCameraRetro className="mr-2 text-blue-700 group-hover:text-blue-800 text-base/6" />
                  <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
                    Take a picture
                  </span>
                  <span className="invisible">Rem</span>
                </Button>
              </div>
            </div>
          )}
          {imageFile.file && !croppedImage && (
            <EasyCrop
              image={imageFile.ImageURL}
              setCroppedImage={setCroppedImage}
              resetImageFile={resetImageFile}
            />
          )}
          {croppedImage && (
            <div className="space-y-8 flex flex-col">
              <h2 className="text-center">
                It could a few minutes to see the change
              </h2>
              <div className="flex justify-center">
                <img
                  src={croppedImage}
                  alt="user"
                  className="rounded-full w-1/4 h-1/4"
                ></img>
              </div>
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-gray-200"></div>
              </div>
              <div className="flex justify-center gap-3">
                <Button
                  color="light"
                  onClick={() => {
                    setCroppedImage(null);
                  }}
                  className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
                  size="xs"
                >
                  <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
                    Cancel
                  </span>
                </Button>
                <button
                  onClick={() => uploadImage(croppedImage)}
                  className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-non border border-transparent rounded-lg focus:ring-2 group focus:ring-transparent bg-indigo-300 ease-linear transition-colors hover:bg-indigo-200 active:bg-indigo-400"
                  size="xs"
                >
                  <span className="invisible">Re</span>
                  <span className="text-blue-700 group-hover:text-blue-800 text-base/6">
                    Save as profile picture
                  </span>
                  <span className="invisible">Re</span>
                </button>
              </div>
            </div>
          )}
          {!imageFile.file && useCamera && (
            <WebcamCapture handleImage={setImageFile} />
          )}
          {/* {imageFile.file && (
            <img
              src={imageFile.ImageURL}
              alt="user"
              className="rounded-full w-1/4 h-1/4"
            ></img>
          )} */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageCropModal;
