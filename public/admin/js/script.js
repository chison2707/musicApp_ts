// upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    // const removeImage = document.querySelector("[removeImage]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            removeImage.style.display = 'block';
        }
    });
    // removeImage.addEventListener("click", () => {
    //     uploadImageInput.value = '';
    //     uploadImagePreview.src = '';
    //     removeImage.style.display = 'none';
    // })
}
// end upload image

// upload audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
    const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
    const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
    const source = uploadAudio.querySelector("source");

    uploadAudioInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const audio = URL.createObjectURL(file);

            source.src = audio;
            uploadAudioPlay.load();
        }
    });
}
// end upload audio