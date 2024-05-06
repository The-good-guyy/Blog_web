import { Avatar } from "flowbite-react";
function PostAuthor({ user }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="shrink-0">
        <Avatar
          alt="user"
          img={user.profilePicture}
          rounded
          className="ml-2"
          size="md"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-gray-900 dark:text-white">
          {user.username}
        </p>
        <p className="truncate text-base text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
      </div>
    </div>
  );
}

export default PostAuthor;
