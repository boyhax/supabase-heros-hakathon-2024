"use client";


import { useState } from "react";
import useFilter from "./hooks/useFilter";

export default function SearchBar() {
  const {set,remove,filter} =useFilter()
  const [value, setvalue] = useState(filter.q||"");

 
  return (
    <div className="join">
      {/* <div> */}
        <div>
          <input
          onChange={(e) => {
            setvalue(e.target?.value!);
          }}
            className="input input-bordered join-item"
            placeholder="Search"
          />
        </div>
      {/* </div> */}
      {/* <select className="select select-bordered join-item">
        <option disabled selected>
          Filter
        </option>
        <option>Sci-fi</option>
        <option>Drama</option>
        <option>Action</option>
      </select> */}
      {/* <div > */}
        {/* <span className="indicator-item badge badge-secondary">new</span> */}
        <button onClick={() => {
            if (value) {
              set("q", value);
            }else{
              remove('q');

            }
          }} className="btn join-item">Search</button>
      {/* </div> */}
    </div>
  );
  
  
}
