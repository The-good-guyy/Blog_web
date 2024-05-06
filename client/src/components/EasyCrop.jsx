import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./Crop";
import { MdScreenRotationAlt } from "react-icons/md";
import { Button } from "flowbite-react";
function EasyCrop({ image, setCroppedImage, resetImageFile }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const changeRotation = () => {
    setRotation((prevState) => {
      return prevState + 90;
    });
  };
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, image, setCroppedImage]);

  return (
    <>
      <div className="space-y-8 flex flex-col">
        <div className="flex justify-center">
          <div className="crop-container mb-2">
            <Cropper
              className="opacity-0"
              image={image}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              zoomSpeed={1}
              maxZoom={18}
              zoomWithScroll={true}
              showGrid={false}
              objectFit={"contain"}
              cropShape={"round"}
              aspect={3 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>
        </div>
        <div className="flex justify-center gap-2 flex-col">
          <Button
            color="light"
            className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
            size="xs"
            onClick={changeRotation}
          >
            <span className="invisible">Rem</span>
            <MdScreenRotationAlt className="mr-2 text-blue-700 group-hover:text-blue-800 text-base/6" />
            <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
              Rotate
            </span>
            <span className="invisible">Rem</span>
          </Button>
          <Button
            color="light"
            className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
            size="xs"
            onClick={showCroppedImage}
          >
            <span className="invisible">R</span>
            <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
              Next
            </span>
            <span className="invisible">R</span>
          </Button>
          <div className="flex justify-center mt-2">
            <button
              className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-non border border-transparent rounded-lg focus:ring-2 group focus:ring-transparent bg-blue-600 ease-linear transition-colors hover:bg-blue-800 active:bg-blue-300"
              size="xs"
              onClick={() => {
                resetImageFile();
              }}
            >
              <span className="invisible">Re</span>
              <span className="text-white text-base/6">Return</span>
              <span className="invisible">Re</span>
            </button>
          </div>
        </div>
      </div>
      <div className="cropped-image-container"></div>
    </>
  );
}

export default EasyCrop;
