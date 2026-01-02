import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Field, TextArea } from "../uiBuilder/UIHelpers";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

const TagsPage = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();


    const query = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(parseInt(query.get("page") || 1));
    const [rowPerPage, setRowPerPage] = useState(parseInt(query.get("count") || 10));

    const [tagsInput, setTagsInput] = useState("");
    const [error, setError] = useState("")

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = useSelector((state) => state.data.tags);
    const totalCount = useSelector((state) => state.data.totalCount);

    // Parse query params on mount
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setCurrentPage(parseInt(query.get("page") || 1));
        setRowPerPage(parseInt(query.get("count") || 10));
    }, [location.search]);

    // Fetch tags from API
    const fetchTags = async () => {
        try {
            setLoading(true);
            const { data, pagination } = await api.get(`/tag?page=${currentPage}&limit=${rowPerPage}`);
            dispatch({ type: "data/set", payload: { tags: data } });
            dispatch({ type: "data/set", payload: { totalCount: pagination.total } });
        } catch (error) {
            console.error("Failed to fetch tags", error);
        } finally {
            setLoading(false);
        }
    };

    const updatePageQueryParam = (paramName, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(paramName, value);
        navigate({ search: searchParams.toString() });
    };

    // Refetch when page or row per page changes
    useEffect(() => {
        fetchTags();
    }, [currentPage, rowPerPage]);

    const columns = [
        { name: "Tag", selector: (row) => row.tag, sortable: true },
        { name: "Slug", selector: (row) => row.slug, sortable: true },
        { name: "Created At", selector: (row) => row.createdAt, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    {/* Edit button */}
                    <button
                        // onClick={() => alert(`Edit ${row.tag}`)}
                        className="flex items-center p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                        // onClick={() => alert(`Delete ${row.tag}`)}
                        onClick={() => { setDeleteModal({ id: row?._id, isOpen: true }) }}
                        className="flex items-center p-1 rounded hover:bg-red-100 text-red-500 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        }

    ];

    const handleDelete = async () => {
        try {
            await api.post("/tag/delete", { ids: [deleteModal.id] });

            toast.success("Entry deleted")
            setDeleteModal({ id: "", isOpen: false })
            fetchTags()
        } catch (error) {
            toast.error("faild to delete ")
        }
    };

    // ===================================== Tag Create Section =====================================
    const getTagsArray = (input) => {
        // Split by new line, trim spaces, and filter out empty strings
        return input
            .split("\n")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");
    };

    const handleSubmit = async () => {
        const tagsArray = getTagsArray(tagsInput);

        if (tagsArray.length === 0) {
            setError('At least one tag add')
            return;
        }

        try {
            // Send to your /tag/add endpoint
            const res = await api.post("/tag/create", { tags: tagsArray });
            setTagsInput(""); // Clear input
            fetchTags()
        } catch (err) {
            console.error(err);
        } finally {
        }
    };

    return (
        <>
            <div className="w-full min-h-screen bg-white p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Tags</h1>
                    <p className="text-sm text-slate-500">Manage Tags</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: Tag List */}
                    <div className="lg:col-span-7 flex flex-col gap-3">
                        <div className="border border-slate-200 rounded-lg bg-white flex flex-col ">
                            <div className="px-5 py-4 border-b border-slate-200">
                                <h2 className="font-medium text-slate-800">Tags List</h2>
                            </div>

                            <DataTable
                                responsive={true}
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                pagination
                                paginationServer
                                paginationTotalRows={totalCount}
                                paginationDefaultPage={currentPage}
                                onChangePage={(page) => {
                                    setCurrentPage(page);
                                    updatePageQueryParam("page", page);
                                }}
                                onChangeRowsPerPage={(value) => {
                                    setRowPerPage(value);
                                    updatePageQueryParam("count", value);
                                }}
                                highlightOnHover
                            />
                        </div>
                    </div>

                    {/* RIGHT: Create Tag Form */}
                    <div className="lg:col-span-5 border border-slate-200 rounded-lg bg-white  flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-200">
                            <h2 className="font-medium text-slate-800">Create Tag</h2>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">

                            <TextArea value={tagsInput}
                                onChange={(e) => {
                                    setTagsInput(e.target.value)
                                    setError('')
                                }}
                                label="Tags"
                                required
                                error={error}
                                placeholder="Enter one tag per line" />

                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 bg-[#31b8c6] text-white rounded-md mt-4 cursor-pointer hover:bg-slate-100 hover:text-slate-900 hover:border-1"
                            >
                                Create Tag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={deleteModal.isOpen}
                loading={isDeleting}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default TagsPage;
