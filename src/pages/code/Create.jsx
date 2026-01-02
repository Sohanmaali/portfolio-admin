import React, { useEffect, useState } from 'react';
import { Layout, Globe, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import Editor from '@monaco-editor/react';
import AsyncCreatableSelect from 'react-select/async-creatable';

import { SectionBlock, Field, Input, TextArea, Select } from '../../uiBuilder/UIHelpers';
import { useParams } from 'react-router-dom';
import { handleCreateTag, loadTags } from '../../utils/TagHelper';

const tabs = [
    { id: 'snippets', label: 'Snippets', icon: <Layout size={16} /> },
    { id: 'repository', label: 'Repository', icon: <Globe size={16} /> },
    { id: 'resources', label: 'Resources', icon: <SettingsIcon size={16} /> },
];

const validationRule = {
    "snippets": {
        title: { required: true, min: 3 },
        code: { required: true, min: 3 },
    },
    repository: {
        ownerName: { required: true, min: 3 },
        repositoryName: { required: true, min: 3 },
        url: { required: true, min: 3 },
    },
    resources: {
        title: { required: true, min: 3 },
        resourceType: { required: true, min: 3 },
        url: { required: true, min: 3 },
    }
}

const Create = () => {
    const [activeTab, setActiveTab] = useState('snippets');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ type: "snippets", snippets: {}, repository: {}, resources: {} });
    const [errors, setErrors] = useState({});
    const [tagDefaultOptions, setTagefaultOptions] = useState([])

    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            setFormData({ type: "snippets", snippets: {}, repository: {}, resources: {} });
            setActiveTab('snippets');
            setErrors({});
        } else {
            const fetchInitialData = async () => {
                try {
                    const { data } = await api.get(`/code/${id}/get`);
                    setFormData({ [data.type]: data[data.type], type: data.type });
                    setActiveTab(data.type);
                } catch {
                    console.error('Could not load settings');
                }
            };
            fetchInitialData();
        }
    }, [id]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [name]: value,
            },
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }))

    };

    const validateForm = (tab, data) => {
        const rules = validationRule[tab];
        const errors = {};

        for (const key in rules) {
            const value = data[key] || '';
            const rule = rules[key];

            if (rule.required && !value.trim()) {
                errors[key] = `${key} is required`;
            } else if (value.length < rule.min) {
                errors[key] = `Minimum ${rule.min} characters required`;
            }
        }

        return errors; // returns all errors, keyed by field name
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm(activeTab, formData[activeTab]);

        if (Object.keys(errors).length > 0) {
            setErrors(errors)
            return;
        }

        setIsSaving(true);

        try {
            if (id) {
                await api.put(`/code/${id}/update`, formData);
                toast.success('Code updated successfully');
            }
            else {
                await api.post('/code/create', formData);
                toast.success("Code added successfully");
                setFormData({ type: activeTab });
            }
        } catch {
            toast.error('Failed to update code');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="w-full space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">Code</h1>
                    <p className="text-sm text-slate-500">Manage Code and resources</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setFormData((prev) => ({
                                    ...prev,       // spread previous formData
                                    type: tab.id,  // add/update the "type" key
                                }));
                            }}

                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition cursor-pointer ${activeTab === tab.id
                                ? 'bg-[#31b8c6] text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl w-full">
                    <div className="p-8 space-y-10">
                        {/* Snippets */}
                        {activeTab === 'snippets' && (
                            <SectionBlock title="Code Snippet">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input name="title" error={errors.title} value={formData[activeTab]?.title || ''} label="Title" required onChange={handleChange} />

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
                                                    ...prev,
                                                    [activeTab]: {
                                                        ...prev[activeTab],
                                                        tags: values, // ✅ only values stored
                                                    },
                                                }));

                                                setErrors(prev => ({ ...prev, tags: '' }));
                                            }}
                                            value={(formData[activeTab]?.tags || []).map(value => ({
                                                label: value,
                                                value: value,
                                            }))}
                                            onCreateOption={(inputValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    [activeTab]: {
                                                        ...prev[activeTab],
                                                        tags: [...(prev[activeTab]?.tags || []), inputValue],
                                                    },
                                                }));
                                            }}
                                            placeholder="Select or create tags..."
                                        />

                                    </Field>
                                </div>

                                <Field label="Code Snippet" required error={errors.code}>
                                    <div className="border rounded-md overflow-hidden">
                                        <Editor
                                            height="250px"
                                            defaultLanguage="javascript"
                                            value={formData[activeTab]?.code || ''}
                                            onChange={(value) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [activeTab]: {
                                                        ...prev[activeTab],
                                                        code: value,
                                                    },
                                                }));
                                                setErrors((prev) => ({ ...prev, code: '' }))
                                            }}
                                            options={{
                                                readOnly: false,
                                                cursorBlinking: 'blink',
                                                fontSize: 14,
                                                lineNumbers: 'on',
                                                wordWrap: 'on',
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                            }}
                                        />
                                    </div>
                                </Field>

                                <TextArea
                                    label="Snippet Description"
                                    name="description"
                                    value={formData[activeTab]?.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    error={errors.description}
                                />
                            </SectionBlock>
                        )}

                        {/* Repository */}
                        {activeTab === 'repository' && (
                            <SectionBlock title="Repository">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <Input
                                        label="Repository Owner" required
                                        name="ownerName"
                                        value={formData[activeTab]?.ownerName || ''}
                                        onChange={handleChange}
                                        error={errors.ownerName}
                                    />
                                    <Input
                                        error={errors.repositoryName}
                                        label="Repository Name" required
                                        name="repositoryName"
                                        value={formData[activeTab]?.repositoryName || ''}
                                        onChange={handleChange}
                                    />

                                    <Input label="URL" error={errors.url} required name="url" value={formData[activeTab]?.url || ''} onChange={handleChange} />

                                </div>
                            </SectionBlock>
                        )}

                        {/* Resources */}
                        {activeTab === 'resources' && (
                            <SectionBlock title="Resources">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input name="title" label="Title" required error={errors.title} value={formData[activeTab]?.title || ''} onChange={handleChange} />


                                    <Select
                                        label="Resources Type" required
                                        name="resourceType"
                                        value={formData[activeTab]?.resourceType || ''}
                                        onChange={handleChange}
                                        options={[
                                            { value: "book", label: "Book" },
                                            { value: "tools", label: "Tools" },
                                            { value: "video", label: "Video" },
                                            { value: "article", label: "Article" },
                                            { value: "course", label: "Course" }
                                        ]}
                                        error={errors.resourceType}
                                        className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm appearance-none focus:outline-none focus:border-[#31b8c6]"
                                    />

                                    <Input name="url" label="URL" required error={errors.url} value={formData[activeTab]?.url || ''} onChange={handleChange} />
                                </div>

                                <TextArea
                                    name="description"
                                    value={formData[activeTab]?.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    label="Resources Description"
                                    error={errors.description}
                                />
                            </SectionBlock>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 text-sm border border-slate-300  cursor-pointer rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            Discard
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 text-sm bg-[#31b8c6] text-white rounded-lg cursor-pointer font-medium disabled:opacity-50"
                        >
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};


export default Create;
