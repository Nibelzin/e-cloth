import { useEffect, useState } from "react";

interface CategoryBarProps{
    categories: string[]
}

const CategoryBar = ({ categories }: CategoryBarProps) => {

    const [show, setShow] = useState(true);
    let lastScroll = 0;

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = document.documentElement.scrollTop;
            if (currentScroll > lastScroll) {
                setShow(false);
            } else {
                setShow(true);
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, []);


    return (
        <div className={`hidden lg:flex fixed w-full mt-16 z-10 bg-white py-4 border-b justify-center items-center transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex gap-12">
                {categories.map(category => (
                    <a href="" key={category} className="font-medium">{category}</a>
                ))}
            </div>
        </div>
    );
}

export default CategoryBar;