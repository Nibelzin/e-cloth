import { useLocation, useNavigate } from "react-router-dom";

export const usePagination = (totalItems: number, itemsPerPage: number) => {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const currPage = parseInt(page ?? "1")
    const numberOfPages = Math.ceil(totalItems / itemsPerPage)

    const handlePageChange = (page: number) => {
        if (page < 1 || page > numberOfPages) return;
        if (page === 1) {
            queryParams.delete("page")
        } else {
            queryParams.set("page", String(page))
        }
        navigate({
            search: queryParams.toString()
        })
    }

    return {
        currPage,
        numberOfPages,
        handlePageChange
    }
}