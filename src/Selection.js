import React, { useRef, useState} from "react";
import './styles/selection.css'
import ProductCanvas from "./ProductCanvas";

function Selection() {

    const [selectedImages, setSelectedImages] = useState({
        frontView: null,
        backView: null,
        sideView: null,
        additionalImages: [],
    });

    const [Canvas,setCanvas] = useState(false)

    const frontViewRef = useRef();
    const backViewRef = useRef();
    const sideViewRef = useRef();
    const additionalImagesRef = useRef();


    const handleGenerateButtonClick = () => {
        const frontViewFile = frontViewRef.current.files[0];
        const backViewFile = backViewRef.current.files[0];
        const sideViewFile = sideViewRef.current.files[0];
        const additionalImagesFiles = Array.from(additionalImagesRef.current.files);
        const form = document.getElementById('imageForm')

        const newSelectedImages = {
            frontView: frontViewFile,
            backView: backViewFile,
            sideView: sideViewFile,
            additionalImages: additionalImagesFiles,
        };

        setSelectedImages(newSelectedImages);
        form.style.display = 'none';
        setCanvas(true)
    };

    return (
        <div>
            <form id="imageForm">
                <label htmlFor="frontView">Front View</label>
                <input
                    id="frontView"
                    type="file"
                    accept="image/*"
                    ref={frontViewRef}
                    required
                />

                <label htmlFor="backView">Back View</label>
                <input
                    id="backView"
                    type="file"
                    accept="image/*"
                    ref={backViewRef}
                    required
                />

                <label htmlFor="sideView">Side View</label>
                <input
                    id="sideView"
                    type="file"
                    accept="image/*"
                    ref={sideViewRef}
                />

                <label htmlFor="additionalImages">Logo Images</label>
                <input
                    id="additionalImages"
                    type="file"
                    accept="image/*"
                    ref={additionalImagesRef}
                    multiple
                />

                <button type="button" onClick={handleGenerateButtonClick}>
                    Generate
                </button>
            </form>
            <div className="canvas-container">
                {Canvas && <ProductCanvas selectedImages={selectedImages} />}
            </div>
        </div>
    );
}

export default Selection;
