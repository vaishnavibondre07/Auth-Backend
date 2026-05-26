import { useState } from "react";
import React from "react";

const PasswordInput = ({ label, placeholder, value, name, onChange}) => {
     const [showPassword, setShowPassword] = useState(false);

     const inputId = name || "password-input";

     return (
       <div className="w-full">
      
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1"> {label} </label>

         <div className="relative">
           <input
              id={inputId}
              name={inputId}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              aria-label={label}

              className="w-full px-3 py-2.5 sm:py-2.5 min-h-[44px] text-base sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
            />

           <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
             className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm transition"
           >
             {showPassword ? "Hide" : "Show"}
           </button>
      </div>
    </div>
  );
};

export default React.memo(PasswordInput);



// import { useState } from "react";
// import React from "react";

// const PasswordInput = ({
//     label,
//     placeholder,
//     value,
//     name,
//     onChange,
// }) => {

//     const [showPassword, setShowPassword] = useState(false);

//     return (
//         <div>
//             <div className="relative">
//                  <label htmlFor={name} className="block text-sm mb-1"> {label}</label>

//                 <input
//                     id={name}
//                     name={name}
//                     type={showPassword ? "text" : "password"}
//                     placeholder={placeholder}
//                     value={value}
//                     onChange={onChange}
//                     className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm transition"
//                 >
//                     {showPassword ? "Hide" : "Show"}
//                 </button>

//             </div>
//         </div>
//     );
// };

// export default React.memo(PasswordInput);