import toast from "react-hot-toast";
import { Address, AddressToAdd, User } from "../types/interfaces";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getUserById(userId: string) {
  const response = await fetch(`${apiUrl}/api/user/${userId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Erro ao buscar este usuário");

  const user: User = await response.json();
  return user;
}

export async function addUserAddress(addressToAdd: AddressToAdd) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressToAdd),
  };

  try {
    const result = await fetch(`${apiUrl}/api/address`, options);
    if (!result.ok) {
      throw new Error(
        `Erro ao adicionar endereço: ${result.status} - ${result.statusText}`
      );
    }
    toast.success("Endereço adicionado com sucesso!");
  } catch (error) {
    console.error(error)
    toast.error("Erro ao adicionar endereço");
  }
}

export async function editUserAddress(address: Address) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  };

  try {
    const result = await fetch(`${apiUrl}/api/address`, options);
    if (!result.ok) {
      throw new Error(
        `Erro ao adicionar endereço: ${result.status} - ${result.statusText}`
      );
    }
    toast.success("Endereço alterado com sucesso!");
  } catch (error) {
    console.error(error)
    toast.error("Erro ao alterar endereço");
  }
}

export async function getUserAddresses(userId: string) {
  const response = await fetch(
    `${apiUrl}/api/user/${userId}/addresses`,
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
      `${apiUrl}/api/address/${addressId}`,
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
      `${apiUrl}/api/address/${addressId}/default`,
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
      `${apiUrl}/api/user/${userId}/phone`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      `${apiUrl}/api/user/${userId}/phone`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Erro ao excluir número de telefone");
    toast.success("Telefone removido com sucesso")
  } catch (error) {
    console.error(error);
    toast.error("Erro ao remover telefone")
  } finally {
    if (setLoading) setLoading(false);
  }
}
