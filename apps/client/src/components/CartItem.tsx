const CartItem = () => {
    return (
        <div className="bg-white border p-4 flex gap-2">
            <div className="w-full">
                <div className="flex items-center h-full justify-between">
                    <div className="h-full items-center flex gap-2">
                        <div className="w-24 h-24 md:w-32 md:h-32">
                            <img src="/products/t-shirt_5.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-full">
                            <h1 className="uppercase font-semibold">Classic T-SHIRT</h1>
                            <p>Tamanho: GG</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="border flex">
                            <button className="border-r flex w-8 justify-center p-2">
                                <p className="font-semibold">-</p>
                            </button>
                            <div className="flex justify-center p-2 w-8">
                                <p className="font-semibold">1</p>
                            </div>
                            <button className="border-l flex w-8 justify-center p-2">
                                <p className="font-semibold">+</p>
                            </button>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">R$ 120,00</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;