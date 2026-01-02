export const submitHalper = (initialValues, validationRules, dispatch) => {
    const errors = {};

    Object.keys(validationRules).forEach((field) => {
        const fieldRules = validationRules[field];
        const value = initialValues[field] || "";
        const stringValue = String(value).trim();

        if (fieldRules.min && stringValue.length < fieldRules.min) {
            errors[field] = `${field.replace("_", " ")} must be at least ${fieldRules.min} characters`;
        }

        if (fieldRules.type === "date" && !isValidDate(value)) {
            errors[field] = `${field.replace("_", " ")} is not a valid date`;
        }

        if (fieldRules.required && !stringValue) {
            errors[field] = `${field.replace("_", " ")} is required`;
        }
    });

    if (initialValues.password && initialValues.confirmPassword && initialValues.password !== initialValues.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
        return { isvalide: false, errors };
    }

    // No errors, return the form values in FormData
    const formData = new FormData();

    Object.keys(initialValues).forEach((key) => {
        if (key === "gallery" && Array.isArray(initialValues[key])) {
            initialValues[key].forEach((item) => {
                if (item instanceof File) {
                    formData.append(key, item);
                } else {
                    formData.append("exist_gallery", JSON.stringify(item));
                }
            });
        } else if (key === "featured_image") {
            if (initialValues[key] instanceof File) {
                formData.append(key, initialValues[key]);
            } else {
                formData.append(key, JSON.stringify(initialValues[key]));
            }
        } else {
            formData.append(key, initialValues[key]);
        }
    });

    return { isvalide: true, data: formData };
};
