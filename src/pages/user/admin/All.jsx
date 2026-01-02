import { Globe, Layout, Pencil, SettingsIcon, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api";
import DeleteModal from "../../../components/DeleteModal";
import toast from "react-hot-toast";
import { DateHelper } from "../../../utils/dateTimeHelper";

export default function All() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const data = useSelector((state) => state.data.admin);
    const totalCount = useSelector((state) => state.data.totalCount);

    // Parse query params on mount
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setCurrentPage(parseInt(query.get("page") || 1));
        setRowPerPage(parseInt(query.get("count") || 10));
    }, [location.search]);

    // Fetch data
    const fetchAdmin = useCallback(async () => {
        try {
            setLoading(true);
            const { data, pagination } = await api.get(`/admin?page=${currentPage}&limit=${rowPerPage}`);
            dispatch({ type: "data/set", payload: { admin: data } });
            dispatch({ type: "data/set", payload: { totalCount: pagination.total } });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [currentPage, rowPerPage, dispatch]);

    useEffect(() => {
        fetchAdmin();
    }, [fetchAdmin]);

    const updatePageQueryParam = (paramName, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(paramName, value);
        navigate({ search: searchParams.toString() });
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await api.post("/admin/delete", { ids: [deleteModal.id] });
            toast.success("Entry deleted");
            setDeleteModal({ isOpen: false, id: null });
            fetchAdmin();
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    // Define columns by tab
    const columns = [
        { name: "First Name", selector: (row) => row.firstName, sortable: true },
        { name: "Last Name", selector: (row) => row.lastName, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Mobile", selector: (row) => row.mobile, sortable: true },
        { name: "Created At", selector: (row) => DateHelper(row.createdAt), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        className="flex items-center p-1 rounded hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/admin/${row._id}/edit`)}
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
        },
    ];


    return (
        <>
            <div className="space-y-10">
                <div className="border border-slate-200 rounded-lg bg-white">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="font-medium text-slate-800">Admin List</h2>
                    </div>

                    <DataTable
                        responsive
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

            <DeleteModal
                isOpen={deleteModal.isOpen}
                loading={isDeleting}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
            />
        </>
    );
}
