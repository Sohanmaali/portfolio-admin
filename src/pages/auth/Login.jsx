import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { Input } from "../../uiBuilder/UIHelpers";

const rules = {
    email: { required: true, min: 5 },
    password: { required: true, min: 6 }
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (data) => {
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

    const handleLogin = async () => {
        const error = validateForm(formData);

        if (Object.keys(error).length > 0) {
            setErrors(error)

            return; // Stop execution if there are errors
        }
        try {
            const data = await loginUser(formData);
            const { user, accessToken, refreshToken } = data.data;
            dispatch(setUser({ user, accessToken, refreshToken }));

            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target; // fixed 'targer' → 'target'
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // fixed 'setErros' → 'setErrors'
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Admin Login
                </h2>

                {/* Email Input */}
                <div className="mb-4">
                    <Input label="Email" name="email" placeholder="you@example.com" required value={formData.email} error={errors?.email} onChange={handleChange} />
                </div>

                {/* Password Input */}
                <div className="mb-4 relative">
                    <Input type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter your password"
                        required
                        name="password"
                        value={formData?.password || ''}
                        error={errors?.password}
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

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Login
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                    Forgot your password?{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                        Reset here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
