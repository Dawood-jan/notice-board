import { ChevronDown } from "lucide-react";


const Select = ({ icon: Icon, id, name, value, onChange, children }) => {
  return (
    <div className="relative">
      {" "}
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 h-full pointer-events-none">
          <Icon className="w-5 h-5 text-green-500" /> {/* Adjusted size */}
        </div>
      )}
      {/* The select dropdown */}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 appearance-none py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
        ${
          value === "" ? 'text-gray-400' : 'text-white'
        }`}
      >
        {children}
      </select>
      {/* ChevronDown icon on the right */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default Select;
