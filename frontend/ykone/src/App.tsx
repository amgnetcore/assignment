import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {columns} from './column'
import axios from 'axios';
import  {DataTable}  from "./table"
import React, { useEffect, useState,ChangeEvent } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const limit = 10; 
  
    const fetchData = async (page:number) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/clients/?page=${page}&limit=${limit}`);
        setData(response.data.clients);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.log(error);
        console.log(error)
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData(page);
    }, [page]); //

    const fetchSearchResults = async (query: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/search?value=${query}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        console.log(error)
        setLoading(false);
      }
    };
    const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      if (query) {
        await fetchSearchResults(query);
      } else {
        await fetchData(page);
      }
    };
  

    const handlePrevious = async () => {
      if (page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        await fetchData(newPage);
      }
    };
  
    const handleNext = async () => {
      if (page < totalPages) {
        const newPage = page + 1;
        setPage(newPage);
        await fetchData(newPage);
      }
    };


  return (
    <div className="px-8 py-20">
      
      <Input className="my-8" type="search" placeholder="search here" value={searchQuery}
        onChange={handleSearchChange} />
      <DataTable columns={columns} data={data} />
      <div className="w-full my-4 flex  justify-end space-x-2">
      <Button onClick={handlePrevious} type="submit">Previous</Button>
      <Button onClick={handleNext} type="submit">Next</Button>
    </div>
    </div>
  )
}
