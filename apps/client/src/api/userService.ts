import toast from "react-hot-toast";
import { Address, User } from "../types/interfaces";

export async function getUserById(userId: string) {
  const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Erro ao buscar este usuário");

  const user: User = await response.json();
  return user;
}

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
    const response = await fetch(
      `http://localhost:3000/api/address/${addressId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Erro ao deletar este endereço");
    toast.success("Endereço removido com sucesso!");
  } catch (error) {
    console.log(error);
  } finally {
    if (setLoading) setLoading(false);
  }
}

export async function setAddressAsUserDefault(
  addressId: string,
  setLoading?: (value: boolean) => void
) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/address/${addressId}/default`,
      {
        method: "PUT",
      }
    );
    if (!response.ok)
      throw new Error("Erro ao definir este endereço como principal");
    toast.success("Endereço definido como principal");
  } catch (error) {
    console.log(error);
  } finally {
    if (setLoading) setLoading(false);
  }
}

export async function alterUserPhoneNumber(
  userId: string,
  phone: string,
  setLoading?: (value: boolean) => void
) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/user/${userId}/phone`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
        }),
      }
    );
    if (!response.ok) throw new Error("Erro ao alterar número de telefone");
    toast.success("Numero adicionado com sucesso!");
  } catch (error) {
    console.log(error);
  } finally {
    if (setLoading) setLoading(false);
  }
}

export async function deleteUserPhoneNumber(
  userId: string,
  setLoading?: (value: boolean) => void
) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/user/${userId}/phone`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Erro ao excluir número de telefone");
  } catch (error) {
    console.log(error);
  } finally {
    if (setLoading) setLoading(false);
  }
}
