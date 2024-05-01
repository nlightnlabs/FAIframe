import axios from "axios";

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"

export const dbUrl = axios.create({
  baseURL,
})

export const fileServerRootPath = "business_engagement_system"

export const uploadFile = async (filePath, file)=>{

    try {
        const response = await dbUrl.post(`/getS3FolderUrl`, {filePath: filePath});
        const url = await response.data;
        const fileURL = await url.split("?")[0];

        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file.data
            });

        return fileURL
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}