import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import { Button } from "flowbite-react";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
const WebcamCapture = ({ handleImage }) => {
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1280,
      height: 720,
    });
    function b64toBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/jpeg" });
    }
    const blob = b64toBlob(imageSrc);
    if (blob) {
      handleImage({ file: blob, ImageURL: URL.createObjectURL(blob) });
    }
  }, [webcamRef, handleImage]);

  return (
    <div className="space-y-8 flex flex-col">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        screenshotQuality={1}
      />
      <div className="flex justify-center">
        <Button
          onClick={capture}
          color="light"
          className="group focus:ring-transparent active:bg-indigo-100 ease-linear transition-colors"
          size="xs"
        >
          <span className="text-blue-700 group-hover:text-blue-800 text-sm/6">
            Capture photo
          </span>
        </Button>
      </div>
    </div>
  );
};
export default WebcamCapture;
