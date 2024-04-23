import axios from "axios";

export const getPersonById = async (id: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/person/findById/${id}`
  );
  return data;
};

export const getPersonsPaginated = async (page: number, size: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/person/paginate?page=${page}&size=${size}`
  );
  return data;
};

export const deletePerson = async (id: string) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/person/delete/${id}`);
};

export const createPerson = async (person: any) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/person/create`, person);
};

export const updatePerson = async (id: string, person: any) => {
  await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/person/update/${id}`,
    person
  );
};
