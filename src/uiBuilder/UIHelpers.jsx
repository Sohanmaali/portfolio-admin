const Field = ({ label, required, children, error }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>

        {children}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);


const Input = ({ label, name, value, onChange, type = "text", placeholder = "", required, readOnly = false, error, maxLength }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500"> *</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} maxLength={maxLength}
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-${readOnly ? 'gray-50' : 'white'} text-${readOnly ? 'gray-500' : 'black'}`} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

    </div>
);

const TextArea = ({ label, name, value, onChange, error, placeholder, required, rows = 5 }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <textarea name={name} value={value} rows={rows} onChange={onChange} className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none`} placeholder={placeholder}></textarea>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const Select = ({ label, name, value, onChange, error, required, options = [] }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}{required && <span className="text-red-500"> *</span>}</label>
        <select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">{`Select  ${label}`}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

    </div>
);

const SectionBlock = ({ title, children }) => (
    <div className="space-y-6">
        <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
            {title}
        </h2>
        {children}
    </div>
);

export { Field, Input, TextArea, Select, SectionBlock }