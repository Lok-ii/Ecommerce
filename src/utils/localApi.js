import axios from "axios";

export const fetchLocalData = async () => {
    try {
        const data = await axios.get("../../assests/Accessories.json");
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}