import { useEffect, useState } from "react";
import { Input, SectionBlock } from "../../../uiBuilder/UIHelpers";
import { submitHalper } from "../../../utils/validateSumbutData";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../../../api";

const validationRules = {
    firstName: { required: true, min: 3 },
    lastName: { required: true, min: 3 },
    mobile: { required: true, min: 3 },
    email: { required: true, min: 3 },
    password: { required: true, min: 6, type: "password" },
    confirmPassword: { required: true, min: 6 },
}

const AddAdmin = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
            });
            setErrors({});
        } else {
            const fetchInitialData = async () => {
                try {
                    const { data } = await api.get(`/admin/${id}/get`);
                    setFormData({
                        firstName: data?.firstName,
                        lastName: data?.lastName,
                        email: data?.email,
                        mobile: data?.mobile,
                    });
                    setActiveTab(data.type);
                } catch {
                    console.error('Could not load settings');
                }
            };
            fetchInitialData();
        }
    }, [id]);

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            delete validationRules.password
            delete validationRules.confirmPassword
        }

        const { isvalide, data, errors } = submitHalper(formData, validationRules);

        if (!isvalide) {
            setErrors(errors);
            return;
        }

        let response;

        try {
            setIsSaving(true);

            if (id) {
                response = await api.put(`/admin/${id}/update`, data);
                toast.success("Admin Update successfully");
            }
            else {
                response = await api.post("/admin/add", data);
                toast.success("Admin added successfully");
            }
            navigate(`/admin/${response?.data?._id}/edit`);
        } catch (err) {
            toast.error("error")
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="min-h-screen  p-6">
                {/* FULL WIDTH CONTAINER */}
                <div className="w-full space-y-6">

                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Admin</h1>
                        <p className="text-sm text-slate-500">
                            Manage platform configuration and branding
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="bg-white mt-5 border border-slate-200 rounded-xl w-full">
                    <div className="p-8 space-y-10">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                required
                                name="firstName"
                                error={errors.firstName}
                                label="First Name"
                                placeholder=" Enter First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />

                            <Input
                                required
                                name="lastName"
                                error={errors.lastName}
                                label="Last Name"
                                placeholder=" Enter Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <Input
                                required
                                name="email"
                                label="Email"
                                type="email"
                                error={errors.email}
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Input
                                required
                                name="mobile"
                                label="Mobile"
                                error={errors.mobile}
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                            {!id && <>
                                <div className="mb-4 relative">

                                    <Input
                                        required
                                        placeholder="Enter your password"
                                        name="password"
                                        label="Password"
                                        error={errors.password}
                                        type={showPassword ? "text" : "password"}
                                        value={formData?.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-9 text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <div className="mb-4 relative">

                                    <Input
                                        required
                                        placeholder="Re-enter password"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        error={errors.confirmPassword}
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData?.confirmPassword}
                                        onChange={handleChange}
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-3 top-9 text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl bg-white">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 hover:cursor-pointer"
                        >
                            Discard
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 text-sm bg-[#31b8c6] text-white rounded-lg font-medium disabled:opacity-50 hover:cursor-pointer"
                        >
                            {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default AddAdmin;
