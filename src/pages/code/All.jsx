import { Globe, Layout, Pencil, SettingsIcon, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import DeleteModal from "../../components/DeleteModal";
import toast from "react-hot-toast";
import { DateHelper } from "../../utils/dateTimeHelper";

const tabs = [
    { id: "snippets", label: "Snippets", icon: <Layout size={16} /> },
    { id: "repository", label: "Repository", icon: <Globe size={16} /> },
    { id: "resources", label: "Resources", icon: <SettingsIcon size={16} /> },
];

export default function All() {
    const [activeTab, setActiveTab] = useState("snippets");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const data = useSelector((state) => state.data.code);
    const totalCount = useSelector((state) => state.data.totalCount);

    // Parse query params on mount
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setCurrentPage(parseInt(query.get("page") || 1));
        setRowPerPage(parseInt(query.get("count") || 10));
    }, [location.search]);

    // Fetch data
    const fetchCode = useCallback(async () => {
        try {
            setLoading(true);
            const { data, pagination } = await api.get(`/code?page=${currentPage}&limit=${rowPerPage}&type=${activeTab}`);
            dispatch({ type: "data/set", payload: { code: data } });
            dispatch({ type: "data/set", payload: { totalCount: pagination.total } });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [activeTab, currentPage, rowPerPage, dispatch]);

    useEffect(() => {
        fetchCode();
    }, [fetchCode]);

    const updatePageQueryParam = (paramName, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(paramName, value);
        navigate({ search: searchParams.toString() });
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await api.post("/code/delete", { ids: [deleteModal.id] });
            toast.success("Entry deleted");
            setDeleteModal({ isOpen: false, id: null });
            fetchCode();
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    // Generate Actions column
    const actionsColumn = {
        name: "Actions",
        cell: (row) => (
            <div className="flex space-x-2">
                <button
                    className="flex items-center p-1 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate(`/code/${row._id}/edit`)}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    className="flex items-center p-1 rounded hover:bg-red-100 text-red-500 cursor-pointer"
                    onClick={() => setDeleteModal({ id: row._id, isOpen: true })}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    };

    // Define columns by tab
    const getColumns = (tab) => {
        switch (tab) {
            case "snippets":
                return [
                    { name: "Title", selector: (row) => row.snippets?.title, sortable: true },
                    { name: "Created At", selector: (row) => DateHelper(row.createdAt), sortable: true },
                    actionsColumn,
                ];
            case "repository":
                return [
                    { name: "Repository Owner", selector: (row) => row.repository?.ownerName, sortable: true },
                    { name: "Repository Name", selector: (row) => row.repository?.repositoryName, sortable: true },
                    { name: "URL", selector: (row) => row.repository?.url, sortable: true },
                    { name: "Created At", selector: (row) => DateHelper(row.createdAt), sortable: true },
                    actionsColumn,
                ];
            case "resources":
                return [
                    { name: "Title", selector: (row) => row.resources?.title, sortable: true },
                    { name: "Resources Type", selector: (row) => row.resources?.resourceType, sortable: true },
                    { name: "URL", selector: (row) => row.resources?.url, sortable: true },
                    { name: "Created At", selector: (row) => DateHelper(row.createdAt), sortable: true },
                    actionsColumn,
                ];
            default:
                return [];
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-6 mb-5">
                <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition cursor-pointer ${activeTab === tab.id
                                ? "bg-[#31b8c6] text-white"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-10">
                <div className="border border-slate-200 rounded-lg bg-white">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="font-medium text-slate-800">Code List</h2>
                    </div>

                    <DataTable
                        responsive
                        columns={getColumns(activeTab)}
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

            <DeleteModal
                isOpen={deleteModal.isOpen}
                loading={isDeleting}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
            />
        </>
    );
}
