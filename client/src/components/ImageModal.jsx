import { Modal, Button } from "flowbite-react";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
function ImageModal({ imageURL, handleModal }) {
  return (
    <>
      <Modal show onClose={() => handleModal(0)} size="sm" dismissible>
        <Modal.Header>Profile Picture</Modal.Header>
        <Modal.Body>
          <div className="space-y-8 flex flex-col">
            <div className="flex justify-center">
              <img
                src={imageURL}
                alt="user"
                className="rounded-full w-3/4 h-3/4"
              ></img>
            </div>
            <div className="flex justify-center gap-2">
              <Button
                color="light"
                onClick={() => handleModal(2)}
                className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
                size="xs"
              >
                <span className="invisible">Rem</span>
                <LuPencil className="mr-2 text-blue-700 group-hover:text-blue-800 text-base/6" />
                <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
                  Change
                </span>
                <span className="invisible">Rem</span>
              </Button>
              <Button
                color="light"
                onClick={() => handleModal(0)}
                className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
                size="xs"
              >
                <span className="invisible">Rem</span>
                <FaRegTrashCan className="mr-2 text-blue-700 group-hover:text-blue-800 text-base/6" />
                <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
                  Remove
                </span>
                <span className="invisible">Rem</span>
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageModal;
