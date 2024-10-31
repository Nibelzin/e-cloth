import toast from "react-hot-toast";
import { Address } from "../types/interfaces";

export async function getUserAddresses(userId: string) {
  const response = await fetch(
    `http://localhost:3000/api/user/${userId}/addresses`,
    {
      method: "GET",
    }
  );
  if (!response.ok) throw new Error("Erro ao buscar endereços deste usuário");

  const addresses: Address[] = await response.json();
  return addresses;
}

export async function deleteUserAddress(
  addressId: string,
  setLoading?: (value: boolean) => void
) {
  try {
    console.log(addressId)
    const response = await fetch(
      `http://localhost:3000/api/address/${addressId}`, {
        method: "DELETE"
      }
    );
    if (!response.ok) throw new Error("Erro ao deletar este endereço");
    toast.success('Endereço removido com sucesso!')
  } catch (error) {
    console.log(error)
  } finally {
    if (setLoading) setLoading(false);
  }
}
