import API from "./api"

export const submitComplaint = async (formData) => {
  try {

    const response = await API.post("/complaints/report", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    console.log("Response:", response.data)
    return response.data

  } catch (error) {

    console.error(error.response?.data || error.message)
    throw error

  }
}