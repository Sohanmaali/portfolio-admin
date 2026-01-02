import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { submitHalper } from '../../utils/validateSumbutData';
import { useDispatch } from 'react-redux';
import getImageSrc from '../../utils/imagePreviewHelper';
import toast from 'react-hot-toast';
import { Field, Input, TextArea } from '../../uiBuilder/UIHelpers';
import Select from 'react-select/base';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { handleCreateTag, loadTags } from '../../utils/TagHelper';

const validationRules = {
    title: { required: true, min: 3 },
    shortDescription: { required: true, min: 10 },
    techStack: { type: "array", required: true },
    featured_image: { type: "file", required: true },
    status: { required: true },
    description: { required: true },
};

const Create = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tagDefaultOptions, setTagefaultOptions] = useState([])


    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        techStack: [],
        projectType: 'personal',
        liveUrl: '',
        githubUrl: '',
        isFeatured: false,
        status: 'draft',
        featured_image: null,
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data } = await api.get(`/tag`);

                const options = data.map(tag => ({
                    value: tag.tag,
                    label: tag.tag
                }));
                setTagefaultOptions(options);
            } catch {
                console.error('Could not load settings');
            }
        };
        fetchInitialData();
    }, []);


    const handleChange = ({ target: { name, value, type, checked } }) => {
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = ({ target: { files } }) => {
        if (files[0]) setFormData(prev => ({ ...prev, featured_image: files[0] }));
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const { isvalide, data, errors } = submitHalper(formData, validationRules, dispatch);

            if (!isvalide) {
                setErrors(errors);
                return;
            }
            let response;
            if (id) {
                response = await api.put(`/project/${id}/update`, data);
                toast.success("Project Update successfully");
            }
            else {
                response = await api.post("/project/add", data);
                toast.success("Project added successfully");
            }


            navigate(`/projects/${response?.data?._id}/edit`);

        } catch (error) {
            toast.error("Faild");
        }
    };

    const fetchProjectData = async () => {
        try {
            const { data } = await api.get(`/project/${id}/get`);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch project data:", error);
        }
    };

    useEffect(() => {
        if (id) fetchProjectData();
    }, [id]);

    const {
        title,
        slug,
        shortDescription,
        description,
        techStack,
        projectType,
        liveUrl,
        githubUrl,
        isFeatured,
        status,
        featured_image
    } = formData;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- FORM SECTION --- */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
                        <div className="flex items-center justify-between p-3.5 group">
                            <span className="text-sm font-bold text-gray-600">Featured</span>
                            <div
                                onClick={() => setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                                className={`w-11 h-6 ml-3 rounded-full relative cursor-pointer transition-all duration-300 shadow-inner ${isFeatured ? 'bg-[#31b8c6]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${isFeatured ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6">
                        {/* Title & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Project Title*" name="title" value={title} error={errors.title} onChange={handleChange} placeholder="My Awesome Project" />
                            <Input label="Slug (Auto-generated)" name="slug" value={slug} readOnly />
                        </div>

                        <Input label="Short Description (Max 200)*" name="shortDescription" value={shortDescription} error={errors.shortDescription} onChange={handleChange} maxLength={200} />

                        <TextArea label="Description*" name="description" value={description} error={errors.description} onChange={handleChange} />

                        {/* Tech Stack */}
                        <Field label="Tags" required error={errors.tags}>

                            <AsyncCreatableSelect
                                isMulti
                                cacheOptions
                                defaultOptions={tagDefaultOptions}
                                loadOptions={loadTags}
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions
                                        ? selectedOptions.map(option => option.value)
                                        : [];

                                    setFormData(prev => ({
                                        ...prev, techStack: values, // ✅ only values stored
                                    }));

                                    setErrors(prev => ({ ...prev, techStack: '' }));
                                }}
                                value={(formData?.techStack || []).map(value => ({
                                    label: value,
                                    value: value,
                                }))} // 🔁 convert values back to objects
                                onCreateOption={(inputValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        techStack: [...(prev?.techStack || []), inputValue],
                                    }));
                                }}
                                placeholder="Select or create tags..."
                            />
                        </Field>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Live URL" name="liveUrl" value={liveUrl} onChange={handleChange} type="url" placeholder="https://..." />
                            <Input label="GitHub URL" name="githubUrl" value={githubUrl} onChange={handleChange} type="url" placeholder="https://github.com/..." />
                        </div>

                        {/* Type & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select label="Project Type" name="projectType" value={projectType} onChange={handleChange} options={["personal", "client", "startup"]} />
                            <Select label="Status" name="status" value={status} onChange={handleChange} options={["draft", "published"]} />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image *</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                            {errors.featured_image && <span className="text-danger">{errors.featured_image}</span>}
                        </div>
                    </form>
                </div>

                {/* --- PREVIEW SECTION --- */}
                <PreviewSection formData={formData} handleSubmit={handleSubmit} />

            </div>
        </div>
    );
};

const PreviewSection = ({ formData, handleSubmit }) => {
    const { featured_image, isFeatured, status, techStack, title, slug, shortDescription, liveUrl, githubUrl } = formData;
    return (
        <div className="lg:col-span-4">
            <div className="sticky top-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Live Preview</h2>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="h-48 bg-gray-200 relative">
                        {featured_image ? (
                            <img src={getImageSrc(featured_image)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold italic">No Cover Image</div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                            {isFeatured && <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow">FEATURED</span>}
                            <span className={`text-[10px] font-bold px-2 py-1 rounded shadow text-white ${status === 'published' ? 'bg-green-500' : 'bg-gray-500'}`}>{status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                            {techStack.map((tech, i) => (
                                <span key={i} className="whitespace-nowrap bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tighter border border-gray-200">{tech}</span>
                            ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{title || "Project Title"}</h3>
                        <p className="text-xs text-blue-600 font-mono mb-3 italic">/{slug || "slug-url"}</p>
                        <p className="text-sm text-gray-600 mb-6 line-clamp-3">{shortDescription || "Short description will appear here..."}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <a href={liveUrl || "#"} className={`text-center py-2 text-xs font-bold rounded-lg border-2 ${liveUrl ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-gray-200 text-gray-300 pointer-events-none'}`}>Live Demo</a>
                            <a href={githubUrl || "#"} className={`text-center py-2 text-xs font-bold rounded-lg border-2 ${githubUrl ? 'border-black text-black hover:bg-gray-50' : 'border-gray-200 text-gray-300 pointer-events-none'}`}>GitHub</a>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 text-white font-bold py-4 rounded-xl  shadow-lg text-sm bg-[#31b8c6] text-white rounded-lg cursor-pointer font-medium disabled:opacity-50"
                    onClick={handleSubmit}>
                    Save Project to Database
                </button>
            </div>
        </div>
    );
};

export default Create;
