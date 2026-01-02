import api from "../api";

const loadTags = async (inputValue) => {
    if (!inputValue) return [];
    try {
        const { data } = await api.get(`/tag?search=${inputValue}`);
        return data.map((tag) => ({ label: tag.tag, value: tag.slug }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

const handleCreateTag = async (inputValue, setFormData, name) => {
    try {
        let { data } = await api.post('/tag/create', { tags: [inputValue] });
        const newOption = { label: data[0].tag, value: data[0].tag };

        setFormData((prev) => ({
            ...prev,
            [name]: [...(prev[name] || []), newOption]  // <-- use empty array if undefined
        }));

    } catch (error) {
        console.error(error);
    }
};

export { loadTags, handleCreateTag }