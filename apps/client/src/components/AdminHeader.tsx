import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { HiMenu, HiOutlineDotsHorizontal } from "react-icons/hi";
import AdditionalInfo from "./AdditionalInfo";

const AdminHeader = () => {
    return (
        <>
            <header className={`w-full  fixed top-0 z-30 bg-white border-b`}>
                <div className="h-16 flex items-center justify-between px-16 py-4">
                    <div className="flex gap-4 items-center">
                        <button className="lg:hidden hover:bg-neutral-100 p-2 rounded-sm transition-colors">
                            <HiMenu size={30} />
                        </button>
                        <button>
                            <img src="/logo-icon.svg" alt="E-Cloth Logo" className="cursor-pointer md:hidden" />
                            <img src="/logo-text.svg" alt="E-Cloth Logo" className="cursor-pointer hidden md:block" />
                        </button>
                        <p className="font-semibold">Admin</p>
                    </div>
                    <div className="hidden lg:block">
                        <SignedOut>
                            <SignInButton>
                                <button className=" p-2 hover:bg-neutral-100 rounded-sm transition-colors h-10">
                                    <p className="text-sm font-semibold">Fazer Login</p>
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton showName >
                                <UserButton.UserProfilePage label="Informações Adicionais" url="custom" labelIcon={<HiOutlineDotsHorizontal />}>
                                    <AdditionalInfo />
                                </UserButton.UserProfilePage>
                            </UserButton>
                        </SignedIn>
                    </div>
                </div>
            </header>
        </>
    );
}

export default AdminHeader;