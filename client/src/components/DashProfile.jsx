import { useSelector, useDispatch } from "react-redux";
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import ImageModal from "./ImageModal";
import ImageCropModal from "./ImageModalCrop";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../../redux/users/userSlice";
import axios from "axios";
import { updateUserRoutes } from "../../utils/ApiRoutes";
import validator from "validator";
function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector(
    (state) => state.user.user
  );
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(0);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const handleValidation = (form) => {
    if (form.username) {
      if (form.username.length < 5 && form.username.length > 30) {
        dispatch(updateFailure("Your username must be 5-30 characters"));
        setUpdateUserError("Your username must be 5-30 characters");
        return false;
      }
    }
    if (form.bio) {
      if (form.bio.length > 180) {
        dispatch(updateFailure("Your bio must be under 180 characters"));
        setUpdateUserError("Your bio must be under 180 characters");
        return false;
      }
    }
    if (form.twitterURL) {
      if (
        !validator.isURL(form.twitterURL, {
          protocols: ["http", "https", "ftp"],
          require_tld: true,
          require_protocol: true,
        }) ||
        !validator.contains(form.twitterURL, "twitter")
      ) {
        dispatch(updateFailure("Invalid twitter URL"));
        setUpdateUserError("Invalid twitter URL");
        return false;
      }
    }
    if (form.githubURL) {
      if (
        !validator.isURL(form.githubURL, {
          protocols: ["http", "https", "ftp"],
          require_tld: true,
          require_protocol: true,
        }) ||
        !validator.contains(form.githubURL, "github")
      ) {
        dispatch(updateFailure("Invalid github URL"));
        setUpdateUserError("Invalid github URL");
        return false;
      }
    }
    if (form.linkedinURL) {
      if (
        !validator.isURL(form.linkedinURL, {
          protocols: ["http", "https", "ftp"],
          require_tld: true,
          require_protocol: true,
        }) ||
        !validator.contains(form.linkedinURL, "linkedin")
      ) {
        dispatch(updateFailure("Invalid linkedin URL"));
        setUpdateUserError("Invalid linkedin URL");
        return false;
      }
    }
    return true;
  };
  const handleChange = (e) => {
    setIsEditing(true);
    setFormData((prevState) => {
      return { ...prevState, [e.target.id]: e.target.value };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateStart());
      if (!handleValidation(formData)) {
        return;
      }
      const data = await axios.put(updateUserRoutes, formData, {
        withCredentials: true,
      });
      console.log(data);
      if (data.status === "fail") {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data.data));
        setUpdateUserSuccess("User information updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {openModal === 1 && (
        <ImageModal
          handleModal={setOpenModal}
          imageURL={currentUser.profilePicture}
        />
      )}
      {openModal === 2 && <ImageCropModal handleModal={setOpenModal} />}
      <h1 className="mt-4 mb-2 text-center font-semibold text-3xl">
        Public profile
      </h1>
      <p className="mb-7 text-center font-semibold text-md">
        Add information about you
      </p>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => {
            setOpenModal(1);
          }}
        >
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-4 border-[lightgray]"
            referrerPolicy="no-referrer"
          ></img>
        </div>
        <div className="mt-2 mb-1 block">
          <Label value="Basics:" className="text-base" />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          disabled={loading}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          disabled
        />
        <textarea
          id="bio"
          rows="4"
          placeholder="Bio"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={currentUser.bio}
          onChange={handleChange}
          disabled={loading}
        ></textarea>
        <div className="flex-1 border-t-2 border-gray-200 my-4"></div>
        <div className="mb-1 block">
          <Label value="Link:" className="text-base" />
        </div>
        <div className="block">
          <Label value="Twitter" htmlFor="twitterURL" className="text-base" />
        </div>
        <TextInput
          type="text"
          id="twitterURL"
          placeholder={
            currentUser.twitterURL === "https://twitter.com/example"
              ? currentUser.twitterURL
              : ""
          }
          defaultValue={
            currentUser.twitterURL === "https://twitter.com/example"
              ? ""
              : currentUser.twitterURL
          }
          onChange={handleChange}
          disabled={loading}
        />
        <div className="block">
          <Label value="Github" htmlFor="githubURL" className="text-base" />
        </div>
        <TextInput
          type="text"
          id="githubURL"
          placeholder={
            currentUser.githubURL === "https://github.com/example"
              ? currentUser.githubURL
              : ""
          }
          defaultValue={
            currentUser.githubURL === "https://github.com/example"
              ? ""
              : currentUser.githubURL
          }
          onChange={handleChange}
          disabled={loading}
        />
        <div className="block">
          <Label value="Linkedin" htmlFor="linkedinURL" className="text-base" />
        </div>
        <TextInput
          type="text"
          id="linkedinURL"
          placeholder={
            currentUser.linkedinURL === "https://linkedin.com/example"
              ? currentUser.linkedinURL
              : ""
          }
          defaultValue={
            currentUser.linkedinURL === "https://linkedin.com/example"
              ? ""
              : currentUser.linkedinURL
          }
          onChange={handleChange}
          disabled={loading}
        />
        {updateUserSuccess && !isEditing && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && !isEditing && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && !isEditing && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}
        <div className="my-4 w-full">
          <Button
            className=""
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default DashProfile;
