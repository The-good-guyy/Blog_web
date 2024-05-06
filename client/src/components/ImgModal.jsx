import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "flowbite-react";
export default function ImgModal({ value, handleModal, imageURL }) {
  return (
    <Transition.Root show={value === 1} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                <div className="bg-white px-4 pb-5 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h2"
                        className="text-xl font-semibold leading-6 text-gray-900"
                      >
                        Profile Picture
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          A picture helps people recognize you
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 mx-8" />
                <div className="flex justify-center my-10">
                  <img
                    src={imageURL}
                    alt="user"
                    className="rounded-full w-3/4 h-3/4"
                  ></img>
                </div>
                <div className="flex justify-center gap-2 pb-6 px-4 sm:px-6">
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
