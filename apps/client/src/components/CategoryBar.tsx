import { useEffect, useRef, useState } from "react";
import { CategoryDTO } from "../types/types";

interface CategoryBarProps {
    isPending?: boolean;
    categories?: CategoryDTO[]
}

const CategoryBar = ({ categories, isPending }: CategoryBarProps) => {
    const [show, setShow] = useState(true);
    const lastScroll = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = document.documentElement.scrollTop;
            if (currentScroll > lastScroll.current) {
                setShow(false);
            } else {
                setShow(true);
            }

            lastScroll.current = currentScroll <= 0 ? 0 : currentScroll;
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, []);


    return (
        <div className={`hidden lg:flex fixed w-full mt-16 z-10 bg-white py-4 border-b justify-center items-center transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex gap-12">
                {isPending ? (
                    <div className="flex gap-4">
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="w-24 h-6 bg-neutral-300 animate-pulse rounded-sm"></div>
                            ))
                        }
                    </div>
                ) : (
                    <>
                        <a href="/" className="font-medium">Todos os Produtos</a>
                        {categories && categories.map(category => (
                            <a key={category.id} href={`/category/${category.name.toLowerCase()}`} className="font-medium">{category.name}</a>
                        ))}
                    </>
                )}

            </div>
        </div>
    );
}

export default CategoryBar;