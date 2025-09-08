import { useEffect,useState } from "react";
import { endpoints,useFetch } from "@/lib/services/endpoints";
//importo las interfaces
import { Ticket,TicketApiResponse, ApiResponse } from "../../../types/ticket-management";

export interface TicketViewModelParams {
    paginacionTicket?:boolean;
    offset?:number;
    ticketsPerPage?:number;
}

export const TicketViewModel = ({paginacionTicket = false,offset = 0,ticketsPerPage = 10,
}: TicketViewModelParams = {}) => {
    const { fetchData } = useFetch();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<any>(null);
    
    
    useEffect(() => {
        const getTickets = async () => {
            const { response, status, errorLogs } = await fetchData<any>(
                endpoints.ticket.getTickets,
                "get"
            );
        }
        getTickets();
    }, []);
    
    
    useEffect(() => {
        getAllTickets();
    },[paginacionTicket,offset,ticketsPerPage])

    const getAllTickets = async () => {
      setLoading(true);
      setError(null);
     try{
        const params = new URLSearchParams();
        if(paginacionTicket) params.append("paginacionTicket",paginacionTicket.toString());
        if(offset) params.append("offset",offset.toString());
        if(paginacionTicket )
        params.append("ticketsPerPage",ticketsPerPage.toString());
        const url =`${endpoints.ticket.getTickets}${params.toString() ? `?${params.toString()}`:""}`
        //const url = "http://localhost:3000/api/ticket"
       
        if(paginacionTicket){
            const { response, status, errorLogs } = await fetchData<TicketApiResponse>(url, "get",);
            if(status === 200 && response && response.success){
                setTickets(response.data);   
                setPageInfo(response.page)                                    
            }
            else{
                const errorMessage= errorLogs?.message|| `Failed to fetch ticket posts (Status ${status})`
                setError(errorMessage)
                setTickets([])
                setPageInfo(null)

            }
        }else{
            const { response, status, errorLogs } = await fetchData<ApiResponse<Ticket>>(url, "get",);
            if(status === 200 && response && response.success){
                setTickets(response.data);                
            }
            else{
                const errorMessage=
                errorLogs?.message||
                response?.message||
                `Failed to fetch ticket post (Status ${status})`
                setError(errorMessage)
                setTickets([])
            }
        }
        }catch(err:any){
            const errorMessage=err.message ||"An unexpected error occurred while fetching ticket post."
            setError(errorMessage)
            setTickets([])
            setPageInfo(null)             
    }finally{
        setLoading(false)
    }
}

return{tickets,loading,error,pageInfo}
}
export default TicketViewModel;