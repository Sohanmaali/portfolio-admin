const getImageSrc = (img) => {
    console.log("jjjjj");

    if (!img) return "";

    // If it's a File (uploaded from input)
    if (img instanceof File) {
        return URL.createObjectURL(img);
    }

    // Otherwise assume it has a path from backend
    if (img.path) {
        return `${import.meta.env.VITE_API_BASE_URL}/${img.path}`;
    }

    return "";
};
export default getImageSrc