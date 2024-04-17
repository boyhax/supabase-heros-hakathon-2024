'use client'
import { useEffect, useState } from "react";

export default  function useFetch<T>( query :  ()=>Promise<T> ) {
  const [data, setdata] = useState<T|any>();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<any>(null);

  useEffect(() => {
    fetch()
  }, []);

  async function fetch(){
    try{
        setloading(true)
        const result = await query()
        setdata(result)
    }catch(error){
        setdata(null)
        seterror(error)
        setloading(false)

    }finally{
        setloading(false)
    }
    
  }


  return { data,error,loading}

}
